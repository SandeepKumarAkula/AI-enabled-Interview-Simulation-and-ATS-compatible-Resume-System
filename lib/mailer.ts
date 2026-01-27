import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587
const user = process.env.SMTP_USER
// Gmail app passwords are sometimes copied with spaces like: "abcd efgh ijkl mnop"
// Nodemailer expects the raw 16-char value, so we strip whitespace.
const pass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : undefined

let transporter: nodemailer.Transporter | null = null
let verified = false

if (host && user && pass) {
  const isGmail = host === 'smtp.gmail.com' || host === 'smtp.googlemail.com'

  transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: 'gmail',
          auth: { user, pass },
        }
      : {
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        },
  )
}

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string }) {
  if (!transporter) {
    const msg = 'SMTP not configured; set SMTP_HOST/SMTP_USER/SMTP_PASSWORD'
    if (process.env.NODE_ENV !== 'production') {
      console.warn(msg)
    }
    throw new Error(msg)
  }

  if (!verified) {
    try {
      await transporter.verify()
      verified = true
    } catch (e: any) {
      const reason = e?.response || e?.message || String(e)
      if (process.env.NODE_ENV !== 'production') {
        console.error('SMTP verify failed:', reason)
      }
      throw e
    }
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html
  })
}
