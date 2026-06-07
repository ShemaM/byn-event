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

async function appendToSheet(row: string[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const idType = formData.get('idType') as string
  const idNumber = formData.get('idNumber') as string
  const organization = formData.get('organization') as string
  const currentPursuits = formData.get('currentPursuits') as string
  const expectedGains = formData.get('expectedGains') as string
  const panelQuestions = formData.get('panelQuestions') as string
  const activities = formData.get('activities') as string
  const dietaryRestrictions = formData.get('dietaryRestrictions') as string
  const mpesaName = formData.get('mpesaName') as string
  const mpesaPhone = formData.get('mpesaPhone') as string
  const consent = formData.get('consent') as string
  const screenshotFile = formData.get('mpesaScreenshot') as File | null

  if (!fullName || !email || !idType || !idNumber || !mpesaName || !mpesaPhone || !screenshotFile || consent !== 'true') {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Convert screenshot to buffer for email attachment
  const screenshotBuffer = Buffer.from(await screenshotFile.arrayBuffer())
  const screenshotFilename = screenshotFile.name || 'mpesa-screenshot.jpg'

  const timestamp = new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://byn-event.vercel.app'
  const approveUrl = `${baseUrl}/api/approve?email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&activities=${encodeURIComponent(activities || '')}`

  const pendingHtml = `
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
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">We got your registration.</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.55);">Youth Get-Together &middot; July 11, 2026 &middot; USIU-Africa, Nairobi</p>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#333;">
                Hi <strong>${fullName}</strong>, thank you for registering. We have received your details and your payment screenshot.
              </p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#555;">
                Our team will review your payment and confirm your spot shortly. You will get another email once that is done.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">
                If you have any questions, reply to this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#1B4FBB;padding:24px 40px;">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.35);line-height:1.6;">
                BYN Kenya &mdash; Banyamulenge Youth Network Kenya
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
<div style="font-family:sans-serif;max-width:600px;">
  <h2 style="color:#1B4FBB;">New Registration: ${fullName}</h2>
  <table style="border-collapse:collapse;font-size:14px;width:100%;">
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Full name</td><td style="padding:6px 12px;">${fullName}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Email</td><td style="padding:6px 12px;">${email}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">ID type</td><td style="padding:6px 12px;">${idType}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">ID number</td><td style="padding:6px 12px;font-family:monospace;font-weight:bold;">${idNumber}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Organization</td><td style="padding:6px 12px;">${organization || '—'}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Current pursuits</td><td style="padding:6px 12px;">${currentPursuits}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Expected gains</td><td style="padding:6px 12px;">${expectedGains}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Panelist questions</td><td style="padding:6px 12px;">${panelQuestions}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Activities</td><td style="padding:6px 12px;">${activities || '—'}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Dietary restrictions</td><td style="padding:6px 12px;">${dietaryRestrictions || '—'}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">M-Pesa name</td><td style="padding:6px 12px;">${mpesaName}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">M-Pesa phone</td><td style="padding:6px 12px;">${mpesaPhone}</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Payment proof</td><td style="padding:6px 12px;">See attached screenshot</td></tr>
    <tr><td style="padding:6px 12px;background:#f0f0f0;font-weight:bold;">Submitted at</td><td style="padding:6px 12px;">${timestamp}</td></tr>
  </table>
  <div style="margin-top:24px;padding:20px;background:#f8f8f5;border-left:4px solid #1B4FBB;">
    <p style="margin:0 0 16px;font-size:13px;color:#555;">Once you have verified the payment screenshot, click the button below to confirm this registration. The user will receive their confirmation email instantly.</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr>
        <td style="background:#1B4FBB;padding:14px 32px;">
          <a href="${approveUrl}" style="color:#ffffff;font-size:14px;font-weight:900;text-decoration:none;font-family:sans-serif;display:block;">
            ✓ Approve Registration
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:11px;color:#999;">If the button does not work, copy and paste this link into your browser:<br/>
    <a href="${approveUrl}" style="color:#1B4FBB;word-break:break-all;">${approveUrl}</a></p>
  </div>
</div>
`

  try {
    await Promise.all([
      transporter.sendMail({
        from: `"Banyamulenge Youth Network Kenya" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'We received your registration — BYN Kenya Youth Get-Together, July 11',
        html: pendingHtml,
      }),
      transporter.sendMail({
        from: `"BYN Registration" <${process.env.GMAIL_USER}>`,
        to: 'opportunitiesbanyamulengeyouth@gmail.com',
        subject: `New Registration: ${fullName} — Payment Screenshot Attached`,
        html: internalHtml,
        attachments: [
          {
            filename: `${fullName.replace(/\s+/g, '_')}_mpesa_${screenshotFilename}`,
            content: screenshotBuffer,
          },
        ],
      }),
      appendToSheet([
        timestamp,
        fullName,
        email,
        idType,
        idNumber,
        organization || '',
        currentPursuits,
        expectedGains,
        panelQuestions,
        activities || '',
        dietaryRestrictions || '',
        mpesaName,
        mpesaPhone,
        'Screenshot attached in email',
      ]),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json({ error: 'Failed to process registration.' }, { status: 500 })
  }
}
