import { Resend } from 'resend'

type EmailPayload = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  headers?: Record<string, string>
  from?: string
}

function isResendConfigured(): boolean {
  return typeof process.env.RESEND_API_KEY === 'string' && process.env.RESEND_API_KEY.length > 0
}

function isSmtpConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  )
}

async function sendWithResend(payload: EmailPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = payload.from || process.env.RESEND_FROM_EMAIL || 'contact@eastatwest.com'

  const result = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    headers: payload.headers as Record<string, string> | undefined,
  })

  if ((result as any)?.error) {
    const err = (result as any).error
    const message = err?.message || 'Failed to send email via Resend'
    const error: any = new Error(message)
    error.provider = 'resend'
    error.details = err
    throw error
  }

  return result
}

async function sendWithSmtp(payload: EmailPayload) {
  // Lazy import nodemailer
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const from = payload.from || process.env.SMTP_FROM_EMAIL || 'contact@eastatwest.com'

  const info = await transporter.sendMail({
    from,
    to: Array.isArray(payload.to) ? payload.to.join(',') : payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    headers: payload.headers,
  })

  return info
}

export async function sendEmail(payload: EmailPayload) {
  if (isResendConfigured()) {
    try {
      return await sendWithResend(payload)
    } catch (err) {
      // If Resend fails and SMTP is configured, try SMTP as fallback
      if (isSmtpConfigured()) {
        return await sendWithSmtp(payload)
      }
      throw err
    }
  }

  if (isSmtpConfigured()) {
    return await sendWithSmtp(payload)
  }

  const error: any = new Error('No email provider configured. Set RESEND_API_KEY or SMTP_* environment variables.')
  error.provider = 'none'
  throw error
}


