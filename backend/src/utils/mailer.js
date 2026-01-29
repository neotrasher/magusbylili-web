import nodemailer from 'nodemailer'

function getTransport(){
  const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASS } = process.env
  if (!BREVO_SMTP_HOST || !BREVO_SMTP_PORT || !BREVO_SMTP_USER || !BREVO_SMTP_PASS) {
    return null
  }
  return nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT),
    secure: Number(BREVO_SMTP_PORT) === 465,
    auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS }
  })
}

export async function sendEmail({ to, subject, html }){
  const transport = getTransport()
  if (!transport) {
    console.log('[MAILER] Missing SMTP config. Email skipped.', { to, subject })
    return
  }
  await transport.sendMail({
    from: process.env.BREVO_SENDER || 'Magus By Lili <no-reply@magusbylili.com>',
    to,
    subject,
    html
  })
}
