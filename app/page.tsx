"use client";

import Link from "next/link";

const components = [
  { name: "quiz",              slug: "quiz",              description: "Multi-type quiz with scoring, explanations and pass/fail",        tag: "Assessment"  },
  { name: "flashcards",       slug: "flashcards",        description: "3-D flip-cards with self-rating (Again / Hard / Good / Easy)",   tag: "Memory"      },
  { name: "match",            slug: "match",             description: "Click-to-match term/definition pairs with mistake tracking",      tag: "Practice"    },
  { name: "fill-blank",       slug: "fill-blank",        description: "Inline cloze exercises with multi-blank and alternative answers", tag: "Practice"    },
  { name: "scramble",         slug: "scramble",          description: "Letter-tile word unscrambling with image and text clues",        tag: "Practice"    },
  { name: "order",            slug: "order",             description: "Drag-and-drop or keyboard item sequencing",                      tag: "Practice"    },
  { name: "reading-passage",  slug: "reading-passage",   description: "Reading comprehension across three phases: read, answer, review", tag: "Assessment"  },
  { name: "progress-tracker", slug: "progress-tracker",  description: "Gamified XP lesson map with streaks, levels and unit progress",  tag: "Navigation"  },
  { name: "spaced-repetition",slug: "spaced-repetition", description: "SM-2 algorithm review session with computed next intervals",     tag: "Memory"      },
  { name: "hotspot",          slug: "hotspot",           description: "Click markers on diagrams and type labels into popovers",        tag: "Assessment"  },
];

const TAG_STYLES: Record<string, string> = {
  Assessment: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Memory:     "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Practice:   "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Navigation: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const TAG_COLOR_MAP: Record<string, { bg: string; color: string; border: string }> = {
  Assessment: { bg: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  Memory:     { bg: "rgba(139,92,246,0.08)", color: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  Practice:   { bg: "rgba(14,165,233,0.08)", color: "#38bdf8", border: "rgba(14,165,233,0.2)" },
  Navigation: { bg: "rgba(16,185,129,0.08)", color: "#34d399", border: "rgba(16,185,129,0.2)" },
};

export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

        :root {
          --bg:        #0a0a0a;
          --surface:   #111111;
          --border:    #1f1f1f;
          --border-hi: #2e2e2e;
          --text:      #e8e8e8;
          --muted:     #666;
          --accent:    #e8e8e8;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Mono', monospace;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ── NAV ── */
        nav {
          border-bottom: 1px solid var(--border);
          padding: 18px 0;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 1.25rem;
          color: var(--text);
          text-decoration: none;
          letter-spacing: -0.01em;
        }
        .nav-links {
          display: flex;
          gap: 24px;
          list-style: none;
        }
        .nav-links a {
          font-size: 0.75rem;
          color: var(--muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.15s;
        }
        .nav-links a:hover { color: var(--text); }

        /* ── HERO ── */
        .hero {
          padding: 96px 0 80px;
          border-bottom: 1px solid var(--border);
        }
        .hero-eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: var(--muted);
          flex-shrink: 0;
        }
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.4rem, 7vw, 5.5rem);
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--text);
          max-width: 700px;
        }
        .hero-title em {
          font-style: italic;
          color: #888;
        }
        .hero-sub {
          margin-top: 28px;
          max-width: 480px;
          font-size: 0.82rem;
          line-height: 1.8;
          color: var(--muted);
        }
        .hero-actions {
          margin-top: 40px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--text);
          color: var(--bg);
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover { opacity: 0.85; }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: transparent;
          color: var(--muted);
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: 1px solid var(--border-hi);
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .btn-ghost:hover { color: var(--text); border-color: #444; }

        /* ── STAT ROW ── */
        .stats {
          display: flex;
          gap: 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          margin: 56px 0;
        }
        .stat {
          flex: 1;
          padding: 28px 12px;
          border-right: 1px solid var(--border);
        }
        .stat:last-child { border-right: none; }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 2.4rem;
          line-height: 1;
          color: var(--text);
        }
        .stat-label {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 6px;
        }

        /* ── SECTION HEADER ── */
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .section-title {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .section-count {
          font-size: 0.7rem;
          color: var(--border-hi);
        }

        /* ── COMPONENT GRID ── */
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .card {
          background: var(--bg);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-decoration: none;
          transition: background 0.15s;
          position: relative;
          overflow: hidden;
        }
        .card::after {
          content: '→';
          position: absolute;
          right: 24px;
          top: 28px;
          color: var(--border-hi);
          font-size: 0.9rem;
          transition: transform 0.2s, color 0.15s;
        }
        .card:hover {
          background: var(--surface);
        }
        .card:hover::after {
          transform: translateX(4px);
          color: var(--muted);
        }
        .card-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text);
          letter-spacing: 0.02em;
          padding-right: 24px;
        }
        .card-desc {
          font-size: 0.72rem;
          color: var(--muted);
          line-height: 1.7;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 8px;
        }
        .card-tag {
          font-size: 0.62rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 8px;
          border: 1px solid;
          border-radius: 0;
        }
        .card-cmd {
          font-size: 0.62rem;
          color: var(--border-hi);
        }

        /* ── INSTALL STRIP ── */
        .install-strip {
          margin: 56px 0;
          border: 1px solid var(--border);
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .install-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .install-cmd {
          font-size: 0.8rem;
          color: var(--text);
          letter-spacing: 0.01em;
          word-break: break-all;
        }
        .install-cmd span { color: var(--muted); }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--border);
          padding: 28px 0;
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-left {
          font-size: 0.7rem;
          color: var(--muted);
        }
        .footer-links {
          display: flex;
          gap: 20px;
          list-style: none;
        }
        .footer-links a {
          font-size: 0.7rem;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-links a:hover { color: var(--text); }

        /* ── MOBILE: ≤ 640px ── */
        @media (max-width: 640px) {
          .page {
            padding: 0 20px;
          }

          /* Nav: hide the middle links, keep logo + github */
          .nav-links li:not(:last-child) {
            display: none;
          }
          .nav-links {
            gap: 16px;
          }

          /* Hero */
          .hero {
            padding: 56px 0 48px;
          }
          .hero-title {
            font-size: clamp(2.2rem, 11vw, 3.2rem);
          }
          .hero-sub {
            font-size: 0.78rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-primary,
          .btn-ghost {
            justify-content: center;
            width: 100%;
          }

          /* Stats: 2×2 grid */
          .stats {
            flex-wrap: wrap;
            margin: 40px 0;
            border-bottom: none;
          }
          .stat {
            flex: 0 0 50%;
            border-bottom: 1px solid var(--border);
            padding: 20px 8;
          }
          .stat:nth-child(even) {
            border-right: none;
          }
          .stat-num {
            font-size: 2rem;
          }

          /* Grid: single column */
          .grid {
            grid-template-columns: 1fr;
          }

          /* Card: tighter padding */
          .card {
            padding: 20px;
          }
          .card::after {
            right: 20px;
            top: 20px;
          }

          /* Install strip */
          .install-strip {
            padding: 24px;
            margin: 40px 0;
            flex-direction: column;
            align-items: stretch;
          }
          .install-strip .btn-ghost {
            justify-content: center;
          }
          .install-cmd {
            font-size: 0.72rem;
          }

          /* Footer */
          footer {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 48px;
          }
        }

        /* ── TABLET: 641px – 768px ── */
        @media (min-width: 641px) and (max-width: 768px) {
          .page {
            padding: 0 24px;
          }
          .hero {
            padding: 72px 0 60px;
          }
          .stats {
            flex-wrap: wrap;
          }
          .stat {
            flex: 0 0 50%;
          }
          .stat:nth-child(even) {
            border-right: none;
          }
          .stat:nth-child(n+3) {
            border-top: 1px solid var(--border);
          }
          .install-strip {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="page">
        <nav>
          <div className="nav-inner">
            <a href="/" className="nav-logo">lmscn</a>
            <ul className="nav-links">
              <li><a href="/docs">Docs</a></li>
              <li><a href="/docs/installation">Install</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <p className="hero-eyebrow">shadcn/ui registry</p>
          <h1 className="hero-title">
            Learning components,<br />
            <em>ready to ship.</em>
          </h1>
          <p className="hero-sub">
            Ten interactive LMS components built on shadcn/ui and Tailwind v4.
            Fully typed, accessible, and wired up with <code style={{color: "#aaa"}}>onComplete</code> callbacks.
            Drop them into your Next.js app and own the code.
          </p>
          <div className="hero-actions">
            <a href="/docs" className="btn-primary">
              Read the docs →
            </a>
            <a href="/docs/installation" className="btn-ghost">
              Installation guide
            </a>
          </div>
        </section>

        {/* Stats */}
        <div className="stats">
          {[
            { num: "10",  label: "Components"     },
            { num: "v4",  label: "Tailwind"        },
            { num: "SM-2",label: "Spaced repetition" },
            { num: "MIT", label: "License"         },
          ].map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="section-header">
          <span className="section-title">Components</span>
          <span className="section-count">{components.length} total</span>
        </div>

        <div className="grid">
          {components.map((c) => {
            const tagColors = TAG_COLOR_MAP[c.tag] || { bg: "transparent", color: "#666", border: "#333" };
            return (
              <a
                key={c.slug}
                href={`/docs/components/${c.slug}`}
                className="card"
              >
                <div className="card-name">{c.name}</div>
                <div className="card-desc">{c.description}</div>
                <div className="card-footer">
                  <span
                    className="card-tag"
                    style={{
                      background: tagColors.bg,
                      color: tagColors.color,
                      borderColor: tagColors.border,
                    }}
                  >
                    {c.tag}
                  </span>
                  <span className="card-cmd">/{c.slug}</span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Install strip */}
        <div className="install-strip">
          <div>
            <div className="install-label">Get started</div>
            <div className="install-cmd">
              <span>npx shadcn@latest add </span>
              https://lmscn.vercel.app/r/quiz.json
            </div>
          </div>
          <a href="/docs/installation" className="btn-ghost">
            All install commands →
          </a>
        </div>

        <footer>
          <span className="footer-left">© {new Date().getFullYear()} lmscn. Built with shadcn/ui.</span>
          <ul className="footer-links">
            <li><a href="/docs">Docs</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </footer>
      </div>
    </>
  );
}