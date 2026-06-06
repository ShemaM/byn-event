'use client'

import { useState } from 'react'

const ACTIVITIES = ['Poetry', 'Dance Challenges', 'Drawing Sessions', 'Printed Cards Activity', 'General Audience']

type FormData = {
  fullName: string
  email: string
  idType: string
  idNumber: string
  organization: string
  currentPursuits: string
  expectedGains: string
  panelQuestions: string
  activities: string[]
  dietaryRestrictions: string
  mpesaName: string
  mpesaPhone: string
  consent: boolean
}

const empty: FormData = {
  fullName: '',
  email: '',
  idType: '',
  idNumber: '',
  organization: '',
  currentPursuits: '',
  expectedGains: '',
  panelQuestions: '',
  activities: [],
  dietaryRestrictions: '',
  mpesaName: '',
  mpesaPhone: '',
  consent: false,
}

const INPUT = 'w-full border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B4FBB] focus:ring-1 focus:ring-[#1B4FBB] transition-colors bg-white'
const TEXTAREA = `${INPUT} min-h-[90px] resize-none`

export default function RegistrationPage() {
  const [form, setForm] = useState<FormData>(empty)
  const [mpesaScreenshot, setMpesaScreenshot] = useState<File | null>(null)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof FormData, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [field]: value }))

  const toggleActivity = (a: string) =>
    set('activities', form.activities.includes(a) ? form.activities.filter((x) => x !== a) : [...form.activities, a])

  const next = () => { setStep((s) => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const back = () => { setStep((s) => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const canProceed1 = form.fullName && form.email && form.idType && form.idNumber
  const canProceed2 = form.currentPursuits && form.expectedGains && form.panelQuestions && form.activities.length > 0
  const canSubmit = form.mpesaName && form.mpesaPhone && mpesaScreenshot && form.consent

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) =>
        body.append(k, Array.isArray(v) ? v.join(', ') : String(v))
      )
      if (mpesaScreenshot) body.append('mpesaScreenshot', mpesaScreenshot)
      const res = await fetch('/api/register', { method: 'POST', body })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong.')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1B4FBB] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white p-12 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#F5C518] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#1B4FBB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="BYN Kenya" className="w-12 h-12 object-contain mx-auto mb-4" />
          <h2 className="text-3xl font-black text-[#1B4FBB] mb-3">You&apos;re in!</h2>
          <p className="text-sm text-gray-500 leading-7 mb-2">
            A confirmation email has been sent to <strong className="text-gray-800">{form.email}</strong>.
          </p>
          <p className="text-sm text-gray-500 leading-7">
            See you on <strong className="text-gray-800">July 11, 2026</strong> at USIU-Africa, Nairobi.
          </p>
          <div className="mt-8 h-1.5 w-full" style={{ background: 'linear-gradient(to right, #D72B2B 33%, #F5C518 33%, #F5C518 66%, #1B4FBB 66%)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Top stripe */}
      <div className="h-1.5 w-full shrink-0" style={{ background: 'linear-gradient(to right, #D72B2B 33%, #F5C518 33%, #F5C518 66%, #1B4FBB 66%)' }} />

      <div className="flex flex-1 flex-col lg:flex-row">

        {/* ── LEFT PANEL: Event info ── */}
        <div className="bg-[#1B4FBB] lg:w-[42%] lg:min-h-screen px-8 py-10 lg:px-12 lg:py-14 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">

          {/* Logo only */}
          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Banyamulenge Youth Kenya" className="w-16 h-16 object-contain" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black text-white leading-tight mb-2">
            Banyamulenge Youth<br />Get-Together
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40 mb-4">Event Registration</p>
          <p className="text-[#F5C518] font-black text-xl mb-1">July 11, 2026</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Venue</span>
            <span className="text-white/70 text-sm">USIU-Africa, Nairobi</span>
          </div>

          {/* Limited slots badge */}
          <a href="#register" className="lg:pointer-events-none inline-flex items-center gap-2 bg-[#D72B2B] px-3 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white">Limited slots. Register now to secure your spot</span>
            <span className="lg:hidden text-white/70 text-[11px] font-black">↓</span>
          </a>

          {/* Description */}
          <div className="space-y-3 mb-8">
            <p className="text-sm text-white/80 leading-7">
              BYN Kenya is organising a get-together for young Banyamulenge people living in Kenya. It is a chance to meet, talk, share stories and connect with others in the community. There will also be testimonials from people doing interesting things, and a chance to hear about and share opportunities.
            </p>
            <p className="text-sm text-white/55 leading-7">
              This form helps us know who is coming and what topics matter to you so we can plan well.
            </p>
            <p className="text-sm text-white/55 leading-7">
              We will only use your information to plan the event and keep you updated.
            </p>
          </div>

          {/* Directions */}
          <div className="border border-white/15 bg-white/5 p-5 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F5C518] mb-5">Getting There</p>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#D72B2B] shrink-0" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wide mb-1">From Nairobi CBD</p>
                  <p className="text-xs text-white/60 leading-6">
                    Take any <strong className="text-white/80">Thika Road matatu</strong> and get off at <strong className="text-white/80">Safari Park Hotel</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-[#F5C518] shrink-0" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wide mb-1">From Thika, Juja, Githurai or Kasarani</p>
                  <p className="text-xs text-white/60 leading-6">
                    Take any matatu <strong className="text-white/80">going towards Nairobi</strong> and get off at <strong className="text-white/80">Safari Park Hotel</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs text-white/55 leading-6">
                From Safari Park Hotel, you can take a <strong className="text-white/75">boda boda (KES 70)</strong> to the USIU gate, or walk. The walk is about <strong className="text-white/75">1.4 km</strong>. We encourage you to come in a group so you can walk together. It is a good way to start the day.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-xs font-black text-white uppercase tracking-wide mb-1">If you are driving</p>
              <p className="text-xs text-white/60 leading-6">
                Take Thika Road and use <strong className="text-white/80">Exit 7, USIU Road</strong>. Search <span className="font-mono text-white/75">USIU-Africa Nairobi</span> on Google Maps.
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            {[
              { n: 1, label: 'Basic Info' },
              { n: 2, label: 'Networking' },
              { n: 3, label: 'Payment' },
            ].map(({ n, label }, i, arr) => (
              <div key={n} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all"
                    onClick={() => { if (n < step) { setStep(n); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                    style={{
                      background: step > n ? '#F5C518' : step === n ? '#ffffff' : 'rgba(255,255,255,0.15)',
                      color: step >= n ? '#1B4FBB' : 'rgba(255,255,255,0.4)',
                      cursor: n < step ? 'pointer' : 'default',
                    }}>
                    {step > n ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : n}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: step === n ? '#F5C518' : 'rgba(255,255,255,0.35)' }}>
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-8 h-[2px] mb-4 transition-colors"
                    style={{ background: step > n ? '#F5C518' : 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Form ── */}
        <div className="flex-1 px-6 py-10 lg:px-14 lg:py-14 max-w-2xl w-full">
          <form id="register" onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-[#D72B2B]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Step 1 — Basic Information</p>
                  </div>
                  <p className="text-sm text-gray-500 leading-7">
                    Tell us a little about yourself so we know who is coming. Your name and email are required — we will use them to send your confirmation and any event updates.
                  </p>
                </div>
                <Field label="Full name" required>
                  <input type="text" value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Your full name" className={INPUT} required />
                </Field>
                <Field label="Email address" required>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com" className={INPUT} required />
                </Field>
                <Field label="Organization / School" hint="Optional">
                  <input type="text" value={form.organization} onChange={(e) => set('organization', e.target.value)}
                    placeholder="Where you study or work" className={INPUT} />
                </Field>

                <div className="overflow-hidden">
                  <div className="h-1" style={{ background: 'linear-gradient(to right, #D72B2B, #F5C518, #1B4FBB)' }} />
                  <div className="bg-[#0f1a2e] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-[#D72B2B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D72B2B]">No Entry Without Valid ID</p>
                    </div>
                    <p className="text-xs text-white/70 leading-6">
                      USIU security requires all visitors to have a valid ID or passport. You must bring your physical ID on the day. Your name will be checked against our list at the gate. <strong className="text-white">No ID means no entry.</strong>
                    </p>
                    <p className="text-xs text-white/50 leading-6 mt-2">
                      Accepted: Alien Card (Refugee ID), Passport, National ID, Proof of Registration, Mandate, or any other government-issued document with your name and photo.
                    </p>
                  </div>
                </div>

                <Field label="ID / Document type" required>
                  <select
                    value={form.idType}
                    onChange={(e) => set('idType', e.target.value)}
                    className={INPUT}
                    required
                  >
                    <option value="">Select your document type</option>
                    <option value="Alien Card (Refugee ID)">Alien Card (Refugee ID)</option>
                    <option value="Passport">Passport</option>
                    <option value="National ID">National ID</option>
                    <option value="Proof of Registration">Proof of Registration</option>
                    <option value="Mandate">Mandate</option>
                    <option value="Other Government-Issued ID">Other Government-Issued ID</option>
                  </select>
                </Field>

                <Field label="ID / Document number" hint="Exactly as it appears on the document" required>
                  <input type="text" value={form.idNumber} onChange={(e) => set('idNumber', e.target.value)}
                    placeholder="e.g. A1234567" className={`${INPUT} font-mono tracking-wider`} required />
                </Field>
                <button type="button" onClick={next} disabled={!canProceed1}
                  className="w-full py-4 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-40 transition-colors mt-4"
                  style={{ background: '#1B4FBB' }}>
                  Continue →
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-[#F5C518]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Step 2 — Networking &amp; Engagement</p>
                  </div>
                  <p className="text-sm text-gray-500 leading-7">
                    This helps us understand who is in the room and make the conversations more meaningful. Share what you are working on, what you hope to take away, and what you would like to ask the panelists.
                  </p>
                </div>
                <Field label="What are you currently studying or pursuing?" required>
                  <textarea value={form.currentPursuits} onChange={(e) => set('currentPursuits', e.target.value)}
                    placeholder="e.g. BSc Computer Science at USIU, freelance graphic design..." className={TEXTAREA} required />
                </Field>
                <Field label="What do you hope to gain from this event?" required>
                  <textarea value={form.expectedGains} onChange={(e) => set('expectedGains', e.target.value)}
                    placeholder="e.g. Meet others in tech, find a mentor, learn about opportunities..." className={TEXTAREA} required />
                </Field>
                <Field label="Any questions for the panelists?" required>
                  <textarea value={form.panelQuestions} onChange={(e) => set('panelQuestions', e.target.value)}
                    placeholder="What would you like to ask?" className={TEXTAREA} required />
                </Field>
                <Field label="Which interactive activities interest you?" required>
                  <div className="mt-2 space-y-3">
                    {ACTIVITIES.map((a) => (
                      <label key={a} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleActivity(a)}>
                        <div className="w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors"
                          style={{
                            background: form.activities.includes(a) ? '#1B4FBB' : 'white',
                            borderColor: form.activities.includes(a) ? '#1B4FBB' : '#d1d5db',
                          }}>
                          {form.activities.includes(a) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{a}</span>
                      </label>
                    ))}
                  </div>
                </Field>
                <Field label="Dietary restrictions or allergies" hint="Optional">
                  <input type="text" value={form.dietaryRestrictions} onChange={(e) => set('dietaryRestrictions', e.target.value)}
                    placeholder="e.g. vegetarian, nut allergy..." className={INPUT} />
                </Field>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={back}
                    className="flex-1 border-2 border-gray-300 px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-gray-600 hover:border-[#1B4FBB] hover:text-[#1B4FBB] transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="button" onClick={next} disabled={!canProceed2}
                    className="flex-[2] py-4 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-40 transition-colors"
                    style={{ background: '#1B4FBB' }}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-6 bg-[#1B4FBB]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Step 3 — Event Contribution</p>
                  </div>
                  <p className="text-sm text-gray-500 leading-7">
                    To ensure accessibility, a <strong className="text-gray-700">KES 500 per person</strong> contribution is requested to cover catering and refreshments, made possible by the organizing committee and sponsors. Please send your contribution to <strong className="text-gray-700">Kibonge Buhimba</strong> to secure your spot and aid in finalizing catering arrangements.
                  </p>
                </div>

                {/* M-Pesa box */}
                <div className="overflow-hidden mb-2">
                  <div className="h-1" style={{ background: 'linear-gradient(to right, #D72B2B, #F5C518, #1B4FBB)' }} />
                  <div className="bg-[#1B4FBB] text-white p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5C518] mb-3">M-Pesa Payment</p>
                    <p className="text-sm text-white/75 leading-7 mb-4">
                      Send <strong className="text-[#F5C518]">KES 500</strong> via M-Pesa to the number below, then fill in your details.
                    </p>
                    <div className="border border-white/20 bg-white/10 px-5 py-4 mb-4">
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Send to</p>
                      <p className="text-3xl font-black text-white tracking-wide">+254 799 978876</p>
                      <p className="text-sm font-bold mt-1" style={{ color: '#F5C518' }}>Amount: KES 500</p>
                    </div>
                    <p className="text-xs text-white/50 leading-6">
                      After sending, take a screenshot of the M-Pesa confirmation message and upload it below as proof of payment.
                    </p>
                  </div>
                </div>

                <Field label="Your official full name" hint="As you want it on the register" required>
                  <input type="text" value={form.fullName} disabled
                    className="w-full border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                </Field>
                <Field label="M-Pesa registered name" hint="Name on the M-Pesa account used to pay" required>
                  <input type="text" value={form.mpesaName} onChange={(e) => set('mpesaName', e.target.value)}
                    placeholder="e.g. Stephen Musyoki" className={INPUT} required />
                </Field>
                <Field label="Phone number used to send" required>
                  <input type="tel" value={form.mpesaPhone} onChange={(e) => set('mpesaPhone', e.target.value)}
                    placeholder="e.g. 0712 345 678" className={INPUT} required />
                </Field>
                <Field label="M-Pesa payment screenshot" required>
                  <label className={`${INPUT} flex items-center gap-3 cursor-pointer`}>
                    <div className="shrink-0 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white" style={{ background: '#1B4FBB' }}>
                      {mpesaScreenshot ? 'Change' : 'Upload'}
                    </div>
                    <span className={`text-sm truncate ${mpesaScreenshot ? 'text-gray-800' : 'text-gray-400'}`}>
                      {mpesaScreenshot ? mpesaScreenshot.name : 'Screenshot of your M-Pesa confirmation message'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setMpesaScreenshot(e.target.files?.[0] ?? null)}
                      required
                    />
                  </label>
                  {mpesaScreenshot && (
                    <div className="mt-2 border border-gray-200 p-1 inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(mpesaScreenshot)}
                        alt="M-Pesa screenshot preview"
                        className="max-h-40 object-contain"
                      />
                    </div>
                  )}
                </Field>

                {/* Consent */}
                <div className="border-l-4 border-[#F5C518] bg-yellow-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500 mb-2">Data Protection &amp; Consent</p>
                  <p className="text-xs text-gray-500 leading-6 mb-4">
                    Your personal information is collected solely for event logistics and record-keeping. It will not be shared with third parties without your explicit permission.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer" onClick={() => set('consent', !form.consent)}>
                    <div className="mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors"
                      style={{
                        background: form.consent ? '#1B4FBB' : 'white',
                        borderColor: form.consent ? '#1B4FBB' : '#d1d5db',
                      }}>
                      {form.consent && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 leading-6">
                      I agree to the data protection terms and confirm that the payment details I have provided are accurate.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="border-l-4 border-[#D72B2B] bg-red-50 px-4 py-3">
                    <p className="text-sm text-[#D72B2B]">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={back}
                    className="flex-1 border-2 border-gray-300 px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-gray-600 hover:border-[#1B4FBB] hover:text-[#1B4FBB] transition-colors bg-white">
                    ← Back
                  </button>
                  <button type="submit" disabled={!canSubmit || submitting}
                    className="flex-[2] py-4 text-sm font-black uppercase tracking-[0.12em] text-white disabled:opacity-40 transition-colors"
                    style={{ background: canSubmit && !submitting ? '#D72B2B' : '#9ca3af' }}>
                    {submitting ? 'Submitting…' : 'Complete Registration →'}
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
      </div>

      {/* Footer stripe */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #D72B2B 33%, #F5C518 33%, #F5C518 66%, #1B4FBB 66%)' }} />
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
        {label}
        {required && <span className="ml-1" style={{ color: '#D72B2B' }}>*</span>}
        {hint && <span className="ml-2 text-[11px] font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}
