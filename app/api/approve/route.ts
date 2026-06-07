import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')
  const name = searchParams.get('name')
  const activities = searchParams.get('activities') || ''

  if (!email || !name) {
    return new NextResponse('Missing required parameters.', { status: 400 })
  }

  const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:#1B4FBB;padding:36px 40px 28px;">
              <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-right:14px;">
                    <img src="https://byn-event.vercel.app/logo.png" alt="BYN Kenya" width="52" height="52" style="display:block;border-radius:4px;" />
                  </td>
                  <td>
                    <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);">Banyamulenge Youth Network Kenya</p>
                    <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">Event Registration</p>
                  </td>
                </tr>
              </table>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">You're in!</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">Youth Get-Together &middot; July 11, 2026 &middot; USIU-Africa, Nairobi</p>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#333;">
                Hi <strong>${name}</strong>, your payment has been confirmed and your spot is secured. We are looking forward to seeing you.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f5;border-left:3px solid #1B4FBB;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:10px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#999;">Event Details</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Date</td><td style="font-size:13px;color:#111;font-weight:600;">Saturday, July 11, 2026</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Venue</td><td style="font-size:13px;color:#111;font-weight:600;">USIU-Africa, Nairobi</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Your name</td><td style="font-size:13px;color:#111;font-weight:600;">${name}</td></tr>
                      ${activities ? `<tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Activities</td><td style="font-size:13px;color:#111;font-weight:600;">${activities}</td></tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#555;">
                Please remember to bring your physical ID or passport on the day. Your name will be checked at the gate.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">
                If you have any questions, reply to this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#1B4FBB;padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">
                BYN Kenya &mdash; Banyamulenge Youth Network Kenya<br />
                This is an automated confirmation. Please keep it for your records.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: `"Banyamulenge Youth Network Kenya" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your spot is confirmed — BYN Kenya Youth Get-Together, July 11',
      html: confirmationHtml,
    })

    return new NextResponse(`
      <html>
        <body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f0;">
          <div style="text-align:center;padding:40px;background:white;max-width:400px;">
            <div style="width:56px;height:56px;border-radius:50%;background:#1B4FBB;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 style="color:#1B4FBB;margin:0 0 12px;font-size:22px;">Confirmed!</h2>
            <p style="color:#555;font-size:14px;line-height:1.7;margin:0;">
              Confirmation email sent to <strong>${email}</strong>.<br/>
              ${name} is now confirmed for the event.
            </p>
          </div>
        </body>
      </html>
    `, { status: 200, headers: { 'Content-Type': 'text/html' } })
  } catch (err) {
    console.error('Approval error:', err)
    return new NextResponse('Failed to send confirmation email.', { status: 500 })
  }
}
