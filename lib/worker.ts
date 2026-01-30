import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '@/lib/prisma'
import { uploadObject, getObjectUrl } from '@/lib/s3'

const redisUrl = process.env.REDIS_URL || ''

let connection: IORedis | null = null
let _videoQueue: any = null

if (redisUrl) {
  connection = new IORedis(redisUrl)
  _videoQueue = new Queue('video-processing', { connection })
} else {
  console.warn('REDIS_URL not set — BullMQ disabled. Background jobs will be no-op.')
  // minimal stub so callers can call `videoQueue.add(...)` without crashing
  _videoQueue = {
    add: async (_name: string, _data: any) => {
      console.warn('videoQueue.add called but REDIS_URL is not configured — skipping job enqueue')
      return Promise.resolve({ id: 'no-redis' })
    }
  }
}

export const videoQueue = _videoQueue as unknown as Queue

// Worker scaffold: in production run this file with ts-node to process jobs
export const startWorker = () => {
  if (!connection) {
    console.warn('startWorker called but REDIS_URL not configured — worker not started')
    return null
  }

  const worker = new Worker(
    'video-processing',
    async (job) => {
      // job.data should include { interviewId, s3Key, videoId }
      try {
        console.log('Processing video job', job.id, job.data)
        const { interviewId, s3Key, videoId } = job.data as any

        // Example processing: generate a simple JSON report and upload to S3
        const report = {
          interviewId,
          videoId,
          analyzedAt: new Date().toISOString(),
          score: {
            communication: Math.round(Math.random() * 100),
            confidence: Math.round(Math.random() * 100),
            correctness: Math.round(Math.random() * 100)
          },
          notes: 'Auto-generated placeholder report. Integrate real analysis here.'
        }

        const key = `reports/${videoId}-${Date.now()}.json`
        const fileUrl = await uploadObject(key, JSON.stringify(report), 'application/json')

        // create report record and link to interview
        const created = await prisma.report.create({
          data: {
            interviewId,
            fileUrl,
            score: report.score,
            userId: (await prisma.interview.findUnique({ where: { id: interviewId } }))?.userId
          }
        })

        // attach to interview (optional since report has interviewId)
        await prisma.interview.update({ where: { id: interviewId }, data: { report: { connect: { id: created.id } } } }).catch(() => null)

        return { ok: true, reportId: created.id }
      } catch (err) {
        console.error('Worker error', err)
        throw err
      }
    },
    { connection: connection as any }
  )

  worker.on('failed', (job, err) => console.error('job failed', job?.id, err))
  console.log('Worker started for video-processing')
  return worker
}

