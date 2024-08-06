import nodemailer, { SentMessageInfo } from "nodemailer"
import { htmlToText } from "html-to-text"
import Mail from "nodemailer/lib/mailer"
import {
  DEBUG_EMAIL_BCC,
  EMAIL_FROM,
  moduleLogger,
  SEND_EMAILS,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMTP_USER,
} from "./config"

const logger = moduleLogger("email")

const TRANSPORTER = {
  pool: true,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
}

const transporter = nodemailer.createTransport(TRANSPORTER)

export type MailTemplate = Mail.Options & {
  subject: string
  html: string
}

export const send = ({ subject, html, to, cc, bcc, attachments }: MailTemplate) => {
  const options: Mail.Options & { text: string } = {
    from: EMAIL_FROM,
    to,
    cc,
    bcc,
    subject,
    text: htmlToText(html),
    html,
    attachments,
  }
  if (SEND_EMAILS) {
    if (DEBUG_EMAIL_BCC) {
      options.bcc = DEBUG_EMAIL_BCC
    }
    return transporter.sendMail(options)
  } else {
    logger.debug(options.text)
    return Promise.resolve("")
  }
}

export const sendMagicCode = (params: MagicCodeMailParams): Promise<SentMessageInfo> => {
  const mail = composeMagicCodeMail(params)
  return send(mail)
}

// templates

const bodyLayout = (body: string) => `
<body style="font-size: 14px;background-color: #F5F4F4;margin: 0;padding: 0;">
<div style="min-height: 500px;margin:auto;max-width: 500px;padding: 34px;background-color: white;border-radius: 0 0 13px 13px;">
<h1 style="font-size: 1.5em; text-align: center;">Nononote</h1>
<br>
${body}
</div>
<div>
<p style="font-size:0.9em; text-align: center;">
<br>
</p>
</div>
</body>`

type Base = {
  to: string
  cc?: string
  bcc?: string
}

type MagicCodeMailParams = Base & {
  magicCode: string
}

const composeMagicCodeMail = ({ to: email, magicCode }: MagicCodeMailParams): MailTemplate => {
  return {
    to: email,
    subject: `Verification code: ${magicCode}`,
    html: bodyLayout(
      `<h2>Let's get you signed in</h2>
  <p>We use this easy login code so you don't have to remember or type in yet another long password.</p>
  <p><strong>Your login code is:</strong></p>
  <h1>${magicCode}</h1>
  <p style="font-size: 0.9rem;">This code is valid for 15 minutes.</p>
  `
    ),
  }
}

export const sendPasswordResetEmail = (params: PasswordResetMailParams): Promise<SentMessageInfo> => {
  const mail = composePasswordResetMail(params)
  return send(mail)
}

type PasswordResetMailParams = Base & {
  resetLink: string
}

const composePasswordResetMail = ({ to: email, resetLink }: PasswordResetMailParams): MailTemplate => {
  return {
    to: email,
    subject: "Password Reset",
    html: bodyLayout(`
      <h2>Password Reset</h2>
      <p>We have received a request to reset your password.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `),
  }
}
