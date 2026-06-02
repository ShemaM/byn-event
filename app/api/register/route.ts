import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  const data = await req.json()

  const {
    fullName,
    email,
    organization,
    currentPursuits,
    expectedGains,
    panelQuestions,
    activities,
    dietaryRestrictions,
    mpesaName,
    mpesaPhone,
    mpesaCode,
    consent,
  } = data

  if (!fullName || !email || !mpesaCode || !mpesaName || !consent) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const activitiesList = Array.isArray(activities) ? activities.join(', ') : activities || 'None selected'

  const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f1a2e;padding:36px 40px 28px;">
              <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding-right:14px;">
                    <img src="https://byn-event.vercel.app/logo.png" alt="BYN Kenya" width="52" height="52" style="display:block;border-radius:4px;" />
                  </td>
                  <td>
                    <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);">Banyamulenge Youth Kenya</p>
                    <p style="margin:2px 0 0;font-size:13px;color:rgba(255,255,255,0.6);">Event Registration</p>
                  </td>
                </tr>
              </table>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">You're registered.</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">Youth Get-Together · July 4, 2026 · USIU-Africa, Nairobi</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#333;">
                Hi <strong>${fullName}</strong>, your registration for the <strong>BYN Kenya Youth Get-Together</strong> is confirmed. We're glad you're coming.
              </p>

              <!-- Details block -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f5;border-left:3px solid #0f1a2e;margin:24px 0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;font-size:10px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#999;">Event Details</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Date</td><td style="font-size:13px;color:#111;font-weight:600;">Saturday, July 4, 2026</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Venue</td><td style="font-size:13px;color:#111;font-weight:600;">USIU-Africa, Nairobi</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Your name</td><td style="font-size:13px;color:#111;font-weight:600;">${fullName}</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">M-Pesa ref</td><td style="font-size:13px;color:#111;font-weight:600;">${mpesaCode}</td></tr>
                      <tr><td style="font-size:13px;color:#666;padding:4px 0;padding-right:16px;">Activities</td><td style="font-size:13px;color:#111;font-weight:600;">${activitiesList}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#555;">
                Keep this email as your proof of registration. Further details about the schedule and logistics will be sent to this address closer to the date.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">
                If you have any questions, reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0f1a2e;padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">
                BYN Kenya — Banyamulenge Youth Network<br />
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

  const internalHtml = `
<h2>New Registration: ${fullName}</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Full name</td><td style="padding:6px 12px;">${fullName}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Organization</td><td style="padding:6px 12px;">${organization || '—'}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Current pursuits</td><td style="padding:6px 12px;">${currentPursuits}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Expected gains</td><td style="padding:6px 12px;">${expectedGains}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Panelist questions</td><td style="padding:6px 12px;">${panelQuestions}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Activities</td><td style="padding:6px 12px;">${activitiesList}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Dietary restrictions</td><td style="padding:6px 12px;">${dietaryRestrictions || '—'}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">M-Pesa name</td><td style="padding:6px 12px;">${mpesaName}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">M-Pesa phone</td><td style="padding:6px 12px;">${mpesaPhone}</td></tr>
  <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">M-Pesa code</td><td style="padding:6px 12px;font-weight:bold;color:#0f1a2e;">${mpesaCode}</td></tr>
</table>
`

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Banyamulenge Youth Network Kenya" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Registration Confirmed — BYN Kenya Youth Get-Together, July 4',
        html: confirmationHtml,
      }),
      transporter.sendMail({
        from: `"BYN Registration" <${process.env.GMAIL_USER}>`,
        to: 'opportunitiesbanyamulengeyouth@gmail.com',
        subject: `New Registration: ${fullName} — M-Pesa ${mpesaCode}`,
        html: internalHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email error:', err)
    return NextResponse.json({ error: 'Failed to send confirmation email.' }, { status: 500 })
  }
}
