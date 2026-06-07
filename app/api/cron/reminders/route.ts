import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const EVENT_DATE = new Date('2026-07-11T09:00:00+03:00')
const SHEET_ID = process.env.GOOGLE_SHEET_ID

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

function daysUntilEvent() {
  const now = new Date()
  const diff = EVENT_DATE.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function reminderKey(days: number): string {
  if (days === 7) return '7d'
  if (days === 3) return '3d'
  if (days === 1) return '1d'
  if (days === 0) return 'day'
  return ''
}

function buildReminderEmail(name: string, days: number): { subject: string; html: string } {
  const headlines: Record<string, string> = {
    '7': '1 week to go!',
    '3': '3 days to go!',
    '1': 'Tomorrow is the day!',
    '0': 'Today is the day!',
  }

  const bodies: Record<string, string> = {
    '7': `We are one week away from the BYN Kenya Youth Get-Together. We are excited to have you there. Here is a quick reminder of what to prepare before Saturday.`,
    '3': `We are 3 days away. Things are coming together and we cannot wait to see you this Saturday. Just a reminder to sort out a few things before the day.`,
    '1': `The get-together is tomorrow, Saturday July 11. Everything is set. Here is your final checklist before you come.`,
    '0': `Today is the day! We are looking forward to seeing you at USIU-Africa this morning. Here is everything you need for today.`,
  }

  const key = String(days)
  const headline = headlines[key] || 'See you soon!'
  const body = bodies[key] || 'We look forward to seeing you at the event.'

  const checklist = days <= 1 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f5;border-left:3px solid #F5C518;margin:20px 0;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#999;">Checklist</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Bring your physical ID or Passport (no entry without it)</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Get off at Safari Park Hotel and walk or take a boda boda (KES 70)</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Come with a group if you can — it is a 1.4 km walk from Safari Park</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Venue: USIU-Africa, Exit 7, USIU Road, Off Thika Rd</p>
      </td></tr>
    </table>` : `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f5;border-left:3px solid #F5C518;margin:20px 0;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:#999;">Quick reminder</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Have your physical ID or Passport ready — you will need it at the gate</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Date: Saturday, July 11, 2026</p>
        <p style="margin:4px 0;font-size:13px;color:#333;">✓ &nbsp;Venue: USIU-Africa, Nairobi</p>
      </td></tr>
    </table>`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#1B4FBB;padding:36px 40px 28px;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="padding-right:14px;"><img src="https://byn-event.vercel.app/logo.png" alt="BYN Kenya" width="52" height="52" style="display:block;border-radius:4px;" /></td>
                <td>
                  <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);">Banyamulenge Youth Network Kenya</p>
                  <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">Youth Get-Together &middot; July 11, 2026</p>
                </td>
              </tr>
            </table>
            <h1 style="margin:0;font-size:28px;font-weight:800;color:#F5C518;line-height:1.2;">${headline}</h1>
            <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">USIU-Africa, Nairobi</p>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#333;">Hi <strong>${name}</strong>,</p>
            <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#555;">${body}</p>
            ${checklist}
            <p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#555;">See you there!</p>
          </td>
        </tr>
        <tr>
          <td style="background:#1B4FBB;padding:24px 40px;">
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">BYN Kenya &mdash; Banyamulenge Youth Network Kenya</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const subjects: Record<string, string> = {
    '7': 'One week to go — BYN Kenya Youth Get-Together, July 11',
    '3': '3 days to go — BYN Kenya Youth Get-Together, July 11',
    '1': 'Tomorrow! BYN Kenya Youth Get-Together — July 11',
    '0': 'Today is the day — BYN Kenya Youth Get-Together',
  }

  return { subject: subjects[key] || 'Reminder — BYN Kenya Youth Get-Together', html }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = daysUntilEvent()
  const key = reminderKey(days)

  if (!key) {
    return NextResponse.json({ message: `No reminder scheduled for ${days} days out.` })
  }

  const sheets = await getSheets()

  // Read all rows: B=name, C=email, O=approved, P=reminders sent
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Sheet1!A:P',
  })

  const rows = res.data.values || []
  const sent: string[] = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const name = row[1] || ''
    const email = row[2] || ''
    const approved = (row[14] || '').toLowerCase()
    const remindersSent = row[15] || ''

    if (!email || approved !== 'yes') continue
    if (remindersSent.includes(key)) continue

    const { subject, html } = buildReminderEmail(name, days)

    try {
      await transporter.sendMail({
        from: `"Banyamulenge Youth Network Kenya" <${process.env.GMAIL_USER}>`,
        to: email,
        subject,
        html,
      })

      // Update column P with the new reminder key
      const updated = remindersSent ? `${remindersSent},${key}` : key
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Sheet1!P${i + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[updated]] },
      })

      sent.push(email)
    } catch (err) {
      console.error(`Failed to send reminder to ${email}:`, err)
    }
  }

  return NextResponse.json({ reminder: key, sent: sent.length, emails: sent })
}
