import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const region = process.env.S3_REGION
const bucket = process.env.S3_BUCKET

const s3Client = new S3Client({
  region,
  credentials:
    process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
      : undefined
})

export async function getPresignedUploadUrl(key: string, contentType = 'application/octet-stream', expiresSeconds = 900) {
  if (!bucket) throw new Error('S3_BUCKET not configured')

  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
  const url = await getSignedUrl(s3Client, command, { expiresIn: expiresSeconds })
  return url
}

export async function getPresignedDownloadUrl(key: string, expiresSeconds = 900) {
  if (!bucket) throw new Error('S3_BUCKET not configured')
  const command = new GetObjectCommand({ Bucket: bucket, Key: key })
  return await getSignedUrl(s3Client, command, { expiresIn: expiresSeconds })
}

export function getObjectUrl(key: string) {
  if (!bucket || !region) throw new Error('S3 not configured')
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`
}

export async function uploadObject(key: string, body: string | Uint8Array | Buffer, contentType = 'application/json') {
  if (!bucket) throw new Error('S3_BUCKET not configured')
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
  await s3Client.send(command)
  return getObjectUrl(key)
}
