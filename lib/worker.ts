import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '@/lib/prisma'
import { uploadObject, getObjectUrl } from '@/lib/s3'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379')

export const videoQueue = new Queue('video-processing', { connection })

// Worker scaffold: in production run this file with ts-node to process jobs
export const startWorker = () => {
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
    { connection }
  )

  worker.on('failed', (job, err) => console.error('job failed', job?.id, err))
  console.log('Worker started for video-processing')
  return worker
}

