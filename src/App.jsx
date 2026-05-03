import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   TiltCard — 3-D perspective tilt + radial gradient tracking
───────────────────────────────────────────────────────────── */
function TiltCard({ children, heroCard = false }) {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const card = ref.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const cx = r.width / 2
    const cy = r.height / 2
    card.style.transform = `perspective(700px) rotateX(${((y - cy) / cy) * -6}deg) rotateY(${((x - cx) / cx) * 6}deg) translateZ(4px)`
    card.style.setProperty('--bx', (x / r.width * 100).toFixed(1) + '%')
    card.style.setProperty('--by', (y / r.height * 100).toFixed(1) + '%')
  }

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`bcard${heroCard ? ' hero-card' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Modal
───────────────────────────────────────────────────────────── */
const CHIP_LABELS = [
  '🔐 True anonymity — review without fear of retaliation',
  '✅ Verified reviews — proof reviewers actually worked there',
  '💰 Accurate, verified salary data I can rely on',
  '🚫 Zero corporate manipulation of ratings',
]

function Modal({ isOpen, onClose, onSubmit, phase }) {
  const [chips, setChips] = useState([false, false, false, false])
  const [customText, setCustomText] = useState('')

  const toggleChip = (i) =>
    setChips((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* ── Form phase ─────────────────────────── */}
        {phase === 'form' && (
          <>
            <div className="modal-eyebrow">One quick thing</div>
            <div className="modal-title">What matters most to you?</div>
            <div className="modal-desc">
              Pick everything that applies — this directly shapes what we build first.
            </div>

            <div className="chips">
              {CHIP_LABELS.map((label, i) => (
                <div
                  key={i}
                  className={`chip${chips[i] ? ' active' : ''}`}
                  onClick={() => toggleChip(i)}
                >
                  <div className="chip-box">
                    <span className="chip-check">✓</span>
                  </div>
                  <div className="chip-lbl">{label}</div>
                </div>
              ))}
            </div>

            <div className="custom-input-wrap">
              <label className="custom-lbl">Anything else on your mind?</label>
              <textarea
                className="custom-input"
                placeholder="Tell us what you'd love to see…"
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            </div>

            <button className="modal-submit" onClick={() => onSubmit(chips, customText)}>
              Submit &amp; Join the Waitlist →
            </button>
          </>
        )}

        {/* ── Thanks phase ───────────────────────── */}
        {phase === 'thanks' && (
          <div className="modal-thanks">
            <span className="modal-thanks-icon">🎉</span>
            <div className="modal-thanks-title">You're on the list.</div>
            <div className="modal-thanks-desc">
              We'll reach out the moment we launch.<br />
              Your input will directly shape what gets built.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Reddit SVG
───────────────────────────────────────────────────────────── */
function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   X (Twitter) SVG
───────────────────────────────────────────────────────────── */
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Copy SVG
───────────────────────────────────────────────────────────── */
function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   App
───────────────────────────────────────────────────────────── */
export default function App() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPhase, setModalPhase] = useState('form') // 'form' | 'thanks'
  const [count, setCount] = useState(0)
  const [joinDone, setJoinDone] = useState(
    () => !!localStorage.getItem('candor_joined')
  )
  const [copyLabel, setCopyLabel] = useState('Copy Link')

  /* ── Animated counter (0 → 312) ─── */
  useEffect(() => {
    const TARGET = 312
    let n = 0
    const timer = setInterval(() => {
      n = Math.min(n + Math.ceil(TARGET / 48), TARGET)
      setCount(n)
      if (n >= TARGET) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [])

  /* ── Lock body scroll when modal is open ─── */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  /* ── Handlers ─── */
  const join = () => {
    const v = email.trim()
    if (!v || !v.includes('@') || !v.includes('.')) {
      setEmailError(true)
      setTimeout(() => setEmailError(false), 1800)
      return
    }
    const joined = localStorage.getItem('candor_joined')
    if (joined === v) {
      setJoinDone(true)
      return
    }
    setModalPhase('form')
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const submitModal = (chips, customText) => {
    const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdZ6OtnZ_qYc_MYLbcWeCB53dN-Ulq2dDwNxN5cZkv_eCxGEg/formResponse'

    const CHIP_KEYS = [
      'Anonymity',
      'Verified reviews',
      'Salary data',
      'No manipulation',
    ]

    const params = new URLSearchParams()
    params.append('entry.1711759945', email.trim())

    chips.forEach((selected, i) => {
      if (selected) params.append('entry.524819314', CHIP_KEYS[i])
    })

    if (customText.trim()) {
      params.append('entry.2005138302', customText.trim())
    }

    fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    localStorage.setItem('candor_joined', email.trim())
    setModalPhase('thanks')
    setCount((n) => n + 1)
    setJoinDone(true)
    setTimeout(() => setModalOpen(false), 3200)
  }

  const copyLink = () => {
    navigator.clipboard
      .writeText('https://condor-teal.vercel.app')
      .then(() => {
        setCopyLabel('Copied!')
        setTimeout(() => setCopyLabel('Copy Link'), 2000)
      })
      .catch(() => setCopyLabel('condor-teal.vercel.app'))
  }

  /* ─────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────── */
  return (
    <>
      {/* Background glows */}
      <div className="bg-glow" />
      <div className="bg-glow2" />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitModal}
        phase={modalPhase}
      />

      <div className="page">

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav>
          <div className="logo">CANDOR<span className="logo-accent">.</span></div>
          <div className="badge">Waitlist Open</div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="hero">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            For engineers who deserve the truth
          </div>

          <h1>
            Workplace reviews<br />
            you can <em>actually</em> trust
          </h1>

          <div className="tagline">
            Like <strong>Glassdoor</strong> — but <em>anonymous like Reddit</em>, verified like your bank.
          </div>

          <p className="hero-desc">
            Real reviews from verified employees. True anonymity by design. Zero corporate
            interference. The platform that finally puts you first.
          </p>

          <div className="form-container">
            {joinDone ? (
              <div className="join-success">
                ✓ You're on the list — we'll reach out when we launch.
              </div>
            ) : (
              <>
                <div className="form-row">
                  <input
                    className="form-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && join()}
                    style={
                      emailError
                        ? { borderColor: 'var(--red)', boxShadow: '0 0 0 3px rgba(255,107,107,0.1)' }
                        : {}
                    }
                  />
                  <button className="form-btn" onClick={join}>
                    Get Early Access →
                  </button>
                </div>
                <div className="form-note">No spam · No selling your data · Unsubscribe anytime</div>
              </>
            )}
          </div>
        </section>

        {/* ── STAT ROW ────────────────────────────────────────── */}
        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-num">{count.toLocaleString()}</div>
            <div className="stat-label">Engineers waiting</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">100%</div>
            <div className="stat-label">Free for job seekers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">0</div>
            <div className="stat-label">Data sold, ever</div>
          </div>
        </div>

        {/* ── BENTO ───────────────────────────────────────────── */}
        <div className="bento">
          <TiltCard heroCard>
            <span className="bcard-icon">🔐</span>
            <div className="bcard-title">
              Anonymous like Reddit.<br />Verified like your bank.
            </div>
            <div className="bcard-desc">
              Work email in → identity decoupled → honest review out. We verify you worked
              somewhere, then immediately and permanently sever the link. Not even we can
              trace a review back to you.
            </div>
          </TiltCard>

          <TiltCard>
            <span className="bcard-icon">✅</span>
            <div className="bcard-title">Verified employees only</div>
            <div className="bcard-desc">
              No work email, no review. Every opinion on Candor comes from someone who
              actually clocked in there — not a PR team, not a competitor.
            </div>
          </TiltCard>

          <TiltCard>
            <span className="bcard-icon">🚫</span>
            <div className="bcard-title">Zero corporate manipulation</div>
            <div className="bcard-desc">
              Companies can never pay to hide, reorder, or bury reviews. What employees say
              is exactly what you see — in chronological order, always.
            </div>
          </TiltCard>

          <TiltCard>
            <span className="bcard-icon">🕒</span>
            <div className="bcard-title">Reviews stay fresh</div>
            <div className="bcard-desc">
              Reviews auto-expire after 3 years unless current employees mark them still
              relevant. No 2019 culture defining a 2025 company.
            </div>
          </TiltCard>

          <TiltCard>
            <span className="bcard-icon">🆓</span>
            <div className="bcard-title">Always free to read</div>
            <div className="bcard-desc">
              No paywalls. No forced sign-ups to browse. All reviews are open to everyone —
              because career information should never be locked behind a gate.
            </div>
          </TiltCard>
        </div>

        {/* ── REVIEW MOCKUP ───────────────────────────────────── */}
        <div className="review-mockup">
          <div className="mockup-bar">
            <div className="mockup-dot r" />
            <div className="mockup-dot y" />
            <div className="mockup-dot g" />
            <div className="mockup-url">getcandor.io/company/acme-corp</div>
          </div>

          <div className="mockup-body">
            {/* Review 1 */}
            <div className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <div className="review-role">Senior Software Engineer</div>
                  <div className="review-anon">Verified employee · Identity protected</div>
                </div>
                <div className="review-stars">★★★★☆</div>
              </div>
              <div className="review-text">
                "Great engineering culture and strong mentorship. Leadership is transparent
                about roadmap decisions. Work-life balance genuinely respected — no after-hours
                slack expectations."
              </div>
              <div className="review-tag">✓ Verified via work email · Posted 2 months ago</div>
            </div>

            {/* Review 2 */}
            <div className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <div className="review-role">Product Manager · 2 yrs</div>
                  <div className="review-anon">Verified employee · Identity protected</div>
                </div>
                <div className="review-stars">★★★☆☆</div>
              </div>
              <div className="review-text">
                "Good product but org structure shifts every 6 months. Compensation is
                competitive. Would recommend for early-career but senior PMs may find scope
                limiting."
              </div>
              <div className="review-tag">✓ Verified via work email · Posted 5 months ago</div>
            </div>
          </div>
        </div>

        {/* ── SHARE ───────────────────────────────────────────── */}
        <div className="share-wrap">
          <div className="section-eyebrow">Spread the Word</div>
          <div className="section-title">Know engineers who deserve better?</div>
          <div className="section-desc">
            Share Candor. Every signup helps us move faster and build what actually matters.
          </div>

          <div className="share-btns">
            <a
              className="sbtn reddit"
              href="https://www.reddit.com/submit?url=https://condor-teal.vercel.app&title=Building%20a%20workplace%20review%20platform%20that%27s%20anonymous%20like%20Reddit%20%E2%80%94%20verified%20employees%20only%2C%20no%20corporate%20manipulation"
              target="_blank"
              rel="noreferrer"
            >
              <RedditIcon />
              Post on Reddit
            </a>

            <a
              className="sbtn xtwit"
              href="https://twitter.com/intent/tweet?text=Workplace%20reviews%20that%20are%20anonymous%20like%20Reddit%2C%20verified%20like%20your%20bank.%0A%0ACandor%20is%20building%20the%20review%20platform%20engineers%20actually%20deserve.%20Early%20access%3A%20https%3A%2F%2Fcondor-teal.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              <XIcon />
              Post on X
            </a>

            <button className="sbtn copy" onClick={copyLink}>
              <CopyIcon />
              <span>{copyLabel}</span>
            </button>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <footer>
          <div className="f-logo">CANDOR<span>.</span></div>
          <div className="f-note">Built in public · No bullshit</div>
        </footer>

      </div>
    </>
  )
}
