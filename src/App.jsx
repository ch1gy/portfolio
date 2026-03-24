import { useState, useEffect, useRef } from "react";
import Layout, { goTo } from "./layout";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DATA = {
  cs50cert: "https://certificates.cs50.io/3b57465d-359b-4f43-bd22-1fd0990c31cf.pdf?size=letter",
  projects: [
    {
      num: "001", title: "Lubmax East Africa", year: "2024",
      category: "Client Work / CS50 Final",
      desc: "Professional website for Lubmax East Africa. A real client, a real deadline, shipped from scratch.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://lubmax.co.ke",
    },
    {
      num: "002", title: "devassist", year: "2026",
      category: "Personal Project / AI Tooling",
      desc: "Multi-model AI developer assistant. Two LLMs answer in parallel, a third synthesises a consensus verdict. Built with production-grade auth — argon2id, HIBP breach detection, JWT rotation, account lockout, and full OWASP Top 10 coverage.",
      tags: ["React", "Python", "Flask", "JWT", "Argon2id", "SQLite", "Groq", "Ollama"],
      link: "https://github.com/ch1gy/Council",
      github: true,
    },
    {
      num: "003", title: "Satellite Council", year: "2026",
      category: "Personal Project / Geospatial AI",
      desc: "Multi-LLM earth observation tool. Fetches real Sentinel-2 satellite imagery from Microsoft Planetary Computer, computes NDVI vegetation indices, and passes data through a 4-model AI Council — a vision model describes the image, a classifier maps land cover, a synthesizer writes environmental reports, and an evaluator scores confidence. Includes time series change detection across up to 4 dates with pixel-level vegetation gain/loss maps and PDF export with embedded imagery and NDVI charts.",
      tags: ["React", "Python", "Flask", "Sentinel-2", "NDVI", "Ollama", "Kimi K2", "Llama 4", "PDF Export", "Vercel", "Railway"],
      link: "https://satellite.chigy.dev/",
    },
  ],
  skills: [
    { name: "Python",                      level: 88 },
    { name: "AI / LLM APIs",              level: 82 },
    { name: "HTML / CSS",                 level: 85 },
    { name: "Flask",                      level: 80 },
    { name: "JavaScript",                 level: 75 },
    { name: "React",                      level: 75 },
    { name: "Sentinel-2 / Remote Sensing",level: 70 },
    { name: "SQL",                        level: 70 },
    { name: "Git / GitHub",               level: 72 },
    { name: "C / C++",                    level: 72 },
  ],
  exploring: ["CompTIA Security+", "Remote Sensing & Environmental AI", "LLM Pipeline Architecture", "Game Dev (C++)"],
};

// ── FONTS & PAGE CSS (sections only — layout CSS lives in Layout.jsx) ─────────
const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Bebas+Neue&family=DM+Mono:wght@300;400&display=swap');
`;

const CSS = `
  /* ── BASE ── */
  :root {
    --cream: #f2ede4;
    --ink:   #0d0d0d;
    --red:   #c8322a;
    --mid:   #6a6560;
    --rule:  #c8c2b8;
    --serif:   'Playfair Display', serif;
    --display: 'Bebas Neue', sans-serif;
    --mono:    'DM Mono', monospace;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { background: var(--cream); color: var(--ink); font-family: var(--serif); overflow-x: hidden; cursor: none; }
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 1000; pointer-events: none; opacity: .03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  /* ── HERO ── */
  .hero {
    padding: 32px 48px 56px;
    display: flex; flex-direction: column; justify-content: flex-start; gap: 24px;
    border-bottom: 3px solid var(--ink); position: relative; overflow: hidden;
  }
  .hero-issue { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--rule); padding-bottom: 16px; margin-bottom: 16px; }
  .hero-issue-text { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .12em; text-transform: uppercase; }
  .hero-issue-num { font-family: var(--display); font-size: 14px; color: var(--red); letter-spacing: .1em; }
  .hero-body { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 0; align-items: end; }
  .hero-title-block { position: relative; min-width: 0; }
  .hero-vol { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .2em; text-transform: uppercase; margin-bottom: 12px; }
  .hero-name-top { font-family: var(--display); font-size: clamp(64px,10vw,140px); line-height: .85; color: var(--ink); }
  .hero-name-bottom { font-family: var(--serif); font-size: clamp(40px,6vw,88px); font-style: italic; font-weight: 400; line-height: .9; color: var(--mid); }
  .hero-right { padding-left: 40px; border-left: 1px solid var(--rule); display: flex; flex-direction: column; justify-content: flex-end; gap: 24px; padding-bottom: 8px; min-width: 0; }
  .hero-tagline { font-size: clamp(18px,2vw,28px); font-weight: 400; line-height: 1.35; }
  .hero-tagline em { font-style: italic; color: var(--red); }
  .hero-meta-row { display: flex; flex-direction: column; gap: 8px; }
  .hero-meta-item { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .1em; text-transform: uppercase; display: flex; gap: 16px; }
  .hero-meta-item span { color: var(--ink); }
  .hero-cta-row { display: flex; gap: 16px; align-items: center; padding-top: 16px; border-top: 1px solid var(--rule); }
  .btn-primary { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; background: var(--ink); color: var(--cream); border: none; padding: 14px 28px; cursor: none; transition: background .2s; }
  .btn-primary:hover { background: var(--red); }
  .btn-text { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--mid); background: none; border: none; cursor: none; transition: color .2s; }
  .btn-text:hover { color: var(--ink); }
  .hero-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; border-top: 1px solid var(--rule); margin-top: auto; }
  .hero-scroll { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .12em; text-transform: uppercase; display: flex; align-items: center; gap: 12px; }
  .hero-scroll-line { width: 40px; height: 1px; background: var(--mid); animation: scrollline 2s ease-in-out infinite; }
  @keyframes scrollline { 0%,100%{width:40px} 50%{width:80px} }
  .hero-location { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .1em; text-transform: uppercase; }
  .hero-bg-num { position: absolute; bottom: -40px; right: -20px; font-family: var(--display); font-size: 400px; line-height: 1; color: transparent; -webkit-text-stroke: 1px var(--rule); pointer-events: none; user-select: none; z-index: 0; opacity: .4; }

  /* ── TICKER ── */
  .ticker { border-top: 2px solid var(--ink); border-bottom: 2px solid var(--ink); padding: 12px 0; overflow: hidden; background: var(--ink); }
  .ticker-inner { display: flex; animation: ticker 20s linear infinite; white-space: nowrap; }
  .ticker-item { font-family: var(--display); font-size: 20px; color: var(--cream); letter-spacing: .08em; padding: 0 40px; }
  .ticker-dot { color: var(--red); }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

  /* ── SHARED ── */
  .section-label { font-family: var(--mono); font-size: 10px; color: var(--red); letter-spacing: .2em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--rule); }
  .red { color: var(--red); }

  /* ── ABOUT ── */
  .about { display: grid; grid-template-columns: minmax(0,1fr) 2px minmax(0,1fr); min-height: 80vh; border-bottom: 3px solid var(--ink); }
  .about-left { padding: 80px 48px; display: flex; flex-direction: column; justify-content: space-between; }
  .about-divider { background: var(--rule); }
  .about-right { padding: 80px 48px; }
  .about-headline { font-family: var(--display); font-size: clamp(56px,7vw,96px); line-height: .9; margin-bottom: 40px; }
  .about-body-text { font-size: 18px; line-height: 1.85; color: var(--mid); margin-bottom: 24px; }
  .about-body-text strong { color: var(--ink); font-weight: 700; }
  .about-facts { display: flex; flex-direction: column; margin-top: 40px; }
  .about-fact { display: grid; grid-template-columns: 120px 1fr; gap: 24px; padding: 16px 0; border-top: 1px solid var(--rule); align-items: baseline; }
  .about-fact:last-child { border-bottom: 1px solid var(--rule); }
  .fact-label { font-family: var(--mono); font-size: 9px; color: var(--mid); letter-spacing: .12em; text-transform: uppercase; }
  .fact-val { font-size: 16px; }
  .fact-link { font-family: var(--mono); font-size: 10px; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--rule); padding-bottom: 1px; transition: border-color .2s, color .2s; }
  .fact-link:hover { color: var(--red); border-color: var(--red); }
  .about-pull { font-size: clamp(22px,3vw,38px); font-style: italic; font-weight: 400; line-height: 1.2; color: var(--ink); border-left: 4px solid var(--red); padding-left: 32px; margin-bottom: 48px; }
  .lang-tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
  .lang-tag { font-family: var(--mono); font-size: 9px; letter-spacing: .1em; text-transform: uppercase; padding: 6px 12px; border: 1px solid var(--rule); color: var(--mid); }

  /* ── PROJECTS ── */
  .projects { border-bottom: 3px solid var(--ink); }
  .projects-header { display: grid; grid-template-columns: auto 1fr; gap: 48px; align-items: baseline; padding: 48px 48px 32px; border-bottom: 1px solid var(--rule); }
  .projects-big-label { font-family: var(--display); font-size: clamp(64px,10vw,140px); line-height: .85; }
  .projects-sub { font-size: 18px; font-style: italic; color: var(--mid); }
  .proj-item { display: grid; grid-template-columns: 80px 1fr auto; gap: 48px; padding: 48px; border-bottom: 1px solid var(--rule); align-items: start; transition: background .3s; position: relative; overflow: hidden; }
  .proj-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: var(--ink); transition: width .4s cubic-bezier(.77,0,.18,1); }
  .proj-item:hover::before { width: 4px; }
  .proj-item:hover { background: rgba(13,13,13,.03); }
  .proj-num { font-family: var(--display); font-size: 48px; line-height: 1; color: var(--rule); transition: color .3s; }
  .proj-item:hover .proj-num { color: var(--red); }
  .proj-cat { font-family: var(--mono); font-size: 9px; color: var(--red); letter-spacing: .15em; text-transform: uppercase; margin-bottom: 12px; }
  .proj-title { font-family: var(--display); font-size: clamp(36px,5vw,64px); line-height: .9; margin-bottom: 16px; transition: color .3s; }
  .proj-item:hover .proj-title { color: var(--red); }
  .proj-desc { font-size: 16px; color: var(--mid); line-height: 1.7; font-style: italic; margin-bottom: 20px; max-width: 560px; }
  .proj-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .proj-tag { font-family: var(--mono); font-size: 9px; letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--rule); color: var(--mid); }
  .proj-action { display: flex; flex-direction: column; align-items: flex-end; gap: 12px; padding-top: 8px; }
  .proj-year { font-family: var(--display); font-size: 48px; color: var(--rule); line-height: 1; }
  .proj-visit { font-family: var(--mono); font-size: 10px; color: var(--ink); text-decoration: none; letter-spacing: .1em; text-transform: uppercase; border-bottom: 1px solid var(--ink); padding-bottom: 2px; transition: color .2s, border-color .2s; white-space: nowrap; }
  .proj-visit:hover { color: var(--red); border-color: var(--red); }
  .proj-soon { padding: 48px; font-family: var(--serif); font-size: 24px; font-style: italic; color: var(--rule); }

  /* ── SKILLS ── */
  .skills { border-bottom: 3px solid var(--ink); display: grid; grid-template-columns: 1fr 1fr; }
  .skills-left { padding: 80px 48px; border-right: 1px solid var(--rule); }
  .skills-right { padding: 80px 48px; }
  .skills-headline { font-family: var(--display); font-size: clamp(64px,8vw,112px); line-height: .85; margin-bottom: 48px; }
  .skill-bar-item { margin-bottom: 24px; }
  .skill-bar-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .skill-bar-name { font-size: 20px; }
  .skill-bar-pct { font-family: var(--mono); font-size: 11px; color: var(--mid); letter-spacing: .08em; }
  .skill-bar-track { height: 2px; background: var(--rule); overflow: hidden; }
  .skill-bar-fill { height: 100%; background: var(--ink); transform: scaleX(0); transform-origin: left; transition: transform 1.2s cubic-bezier(.77,0,.18,1); }
  .skill-bar-fill.on { transform: scaleX(1); }
  .exploring-header { font-family: var(--display); font-size: 36px; margin-bottom: 24px; color: var(--mid); }
  .exploring-items { display: flex; flex-direction: column; }
  .exploring-item { display: flex; align-items: center; gap: 16px; padding: 20px 0; border-bottom: 1px solid var(--rule); font-size: 22px; font-style: italic; }
  .exploring-item:first-child { border-top: 1px solid var(--rule); }
  .exploring-dot { width: 8px; height: 8px; background: var(--red); border-radius: 50%; flex-shrink: 0; animation: blink 2s ease-in-out infinite; }
  .exploring-badge { font-family: var(--mono); font-size: 8px; letter-spacing: .1em; color: var(--red); border: 1px solid var(--red); padding: 2px 6px; text-transform: uppercase; margin-left: auto; }

  /* ── REVEAL ── */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .9s ease, transform .9s ease; }
  .reveal.on { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-32px); transition: opacity .9s ease, transform .9s ease; }
  .reveal-left.on { opacity: 1; transform: translateX(0); }

  /* ── LARGE SCREEN (1400px+) ── */
  @media (min-width: 1400px) {
    .hero { padding: 24px 120px 48px; }
    .hero-name-top { font-size: clamp(64px, 7vw, 120px); }
    .hero-name-bottom { font-size: clamp(40px, 4.5vw, 72px); }
    .about-left, .about-right { padding: 80px 120px; }
    .projects-header { padding: 48px 120px 32px; }
    .proj-item { padding: 48px 120px; }
    .skills-left, .skills-right { padding: 80px 120px; }
  }

  /* ── TABLET (max 1024px) ── */
  @media (max-width: 1024px) {
    .hero-name-top { font-size: clamp(72px, 12vw, 140px); }
    .hero-name-bottom { font-size: clamp(40px, 7vw, 80px); }
    .about-headline { font-size: clamp(48px, 6vw, 72px); }
    .skills-headline { font-size: clamp(48px, 6vw, 80px); }
    .projects-big-label { font-size: clamp(48px, 8vw, 100px); }
  }

  /* ── MOBILE (max 768px) ── */
  @media (max-width: 768px) {
    body { cursor: auto; }
    .hero { padding: 20px 20px 40px; }
    .hero-issue { margin-bottom: 12px; padding-bottom: 12px; }
    .hero-issue-text { font-size: 8px; }
    .hero-body { grid-template-columns: 1fr; gap: 24px; }
    .hero-name-top { font-size: clamp(64px, 18vw, 100px); }
    .hero-name-bottom { font-size: clamp(36px, 10vw, 56px); }
    .hero-right { border-left: none; border-top: 1px solid var(--rule); padding-left: 0; padding-top: 24px; gap: 20px; }
    .hero-tagline { font-size: clamp(18px, 5vw, 24px); }
    .hero-footer { margin-top: 24px; padding-top: 20px; }
    .hero-bg-num { font-size: 140px; opacity: .2; }
    .about { grid-template-columns: 1fr; }
    .about-divider { display: none; }
    .about-left, .about-right { padding: 48px 20px; }
    .about-headline { font-size: clamp(56px, 16vw, 80px); }
    .about-pull { font-size: clamp(20px, 5vw, 28px); padding-left: 20px; }
    .about-body-text { font-size: 16px; }
    .projects-header { grid-template-columns: 1fr; gap: 8px; padding: 32px 20px; }
    .projects-big-label { font-size: clamp(48px, 14vw, 72px); }
    .proj-item { grid-template-columns: 1fr; gap: 12px; padding: 28px 20px; }
    .proj-num { font-size: 32px; }
    .proj-title { font-size: clamp(28px, 8vw, 44px); }
    .proj-action { align-items: flex-start; flex-direction: row; justify-content: space-between; }
    .proj-year { font-size: 28px; }
    .proj-soon { padding: 32px 20px; }
    .skills { grid-template-columns: 1fr; }
    .skills-left { border-right: none; border-bottom: 1px solid var(--rule); padding: 48px 20px; }
    .skills-right { padding: 48px 20px; }
    .skills-headline { font-size: clamp(56px, 16vw, 80px); }
    .skill-bar-name { font-size: 16px; }
    .exploring-item { font-size: 18px; }
    .ticker-inner { animation-duration: 10s; }
  }
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function useReveal(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, [ref]);
  return v;
}

function Reveal({ children, delay = 0, cls = "reveal" }) {
  const ref = useRef(null);
  const vis = useReveal(ref);
  return (
    <div ref={ref} className={`${cls}${vis ? " on" : ""}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function SkillBar({ name, level, delay }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="skill-bar-item">
      <div className="skill-bar-top">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-pct">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div className={`skill-bar-fill${on ? " on" : ""}`} style={{ width: `${level}%`, transitionDelay: `${delay}s` }} />
      </div>
    </div>
  );
}

function Ticker() {
  const items = ["Software Engineer", "CS50 Graduate", "Python", "Flask", "React", "AI & LLMs", "Geospatial", "Open to Work", "Nairobi, East Africa", "Building Things"];
  const doubled = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {doubled.map((t, i) => (
          <span key={i} className="ticker-item">{t} <span className="ticker-dot">✦</span> </span>
        ))}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{FONTS + CSS}</style>
      <Layout>

        {/* ── HERO ── */}
        <section className="hero" id="home">
          <div className="hero-issue">
            <span className="hero-issue-text">Portfolio — Software Engineer — Nairobi, East Africa</span>
            <span className="hero-issue-num">VOL. 69</span>
          </div>
          <div className="hero-body">
            <div className="hero-title-block">
              <div className="hero-vol">The Engineer</div>
              <div className="hero-name-top">CHIRAAG</div>
              <div className="hero-name-bottom">Barot.</div>
            </div>
            <div className="hero-right">
              <p className="hero-tagline">
                I build tools that work — from <em>client sites</em> to AI-powered satellite analysis systems.
              </p>
              <div className="hero-meta-row">
                <div className="hero-meta-item">Location <span>Nairobi, East Africa</span></div>
                <div className="hero-meta-item">Status <span>Open to freelance & full-time</span></div>
                <div className="hero-meta-item">Education <span>Harvard CS50</span></div>
              </div>
              <div className="hero-cta-row">
                <button className="btn-primary" onClick={() => goTo("projects")}>View My Work</button>
                <button className="btn-text" onClick={() => goTo("contact")}>Get in touch →</button>
              </div>
            </div>
          </div>
          <div className="hero-footer">
            <div className="hero-scroll"><div className="hero-scroll-line" />Scroll to explore</div>
            <div className="hero-location">Nairobi · 2026</div>
          </div>
          <div className="hero-bg-num">01</div>
        </section>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── ABOUT ── */}
        <section id="about" className="about">
          <div className="about-left">
            <div>
              <div className="section-label">Profile</div>
              <Reveal>
                <div className="about-headline">WHO<br />I<br /><span className="red">AM.</span></div>
              </Reveal>
              <div className="about-facts">
                <div className="about-fact">
                  <span className="fact-label">Based in</span>
                  <span className="fact-val">Nairobi, East Africa</span>
                </div>
                <div className="about-fact">
                  <span className="fact-label">Education</span>
                  <span className="fact-val">
                    Harvard CS50 —&nbsp;
                    <a href={DATA.cs50cert} className="fact-link" target="_blank" rel="noreferrer">certificate ↗</a>
                  </span>
                </div>
                <div className="about-fact">
                  <span className="fact-label">Status</span>
                  <span className="fact-val">Freelance & full-time</span>
                </div>
                <div className="about-fact">
                  <span className="fact-label">Live sites</span>
                  <span className="fact-val" style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                    <a href="https://lubmax.co.ke" className="fact-link" target="_blank" rel="noreferrer">lubmax.co.ke ↗</a>
                    <a href="https://satellite.chigy.dev" className="fact-link" target="_blank" rel="noreferrer">satellite.chigy.dev ↗</a>
                  </span>
                </div>
              </div>
            </div>
            <div className="lang-tag-row">
              {["English", "Gujarati", "Swahili"].map(l => (
                <span key={l} className="lang-tag">{l}</span>
              ))}
            </div>
          </div>
          <div className="about-divider" />
          <div className="about-right">
            <div className="section-label">Story</div>
            <Reveal delay={0.1}>
              <p className="about-pull">"I learned by doing — CS50 gave me the foundations, real projects gave me the rest."</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="about-body-text">My stack is <strong>Python, Flask, and JavaScript</strong>, with a low-level foundation in <strong>C and C++</strong> that makes me think carefully about how things actually work.</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="about-body-text">I built the <strong>Lubmax East Africa</strong> website as a real client project and CS50 final — a real client, a real deadline, shipped from scratch and live at lubmax.co.ke.</p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="about-body-text">I've built production AI tools including <strong>devassist</strong> — a multi-model developer assistant with full OWASP-compliant auth — and <strong>Satellite Council</strong>, a geospatial AI system that fetches real Sentinel-2 satellite imagery, computes NDVI vegetation indices, and runs multi-LLM analysis pipelines.</p>
            </Reveal>
            <Reveal delay={0.5}>
              <p className="about-body-text">Currently studying for <strong>CompTIA Security+</strong>, deepening my work in <strong>remote sensing and environmental AI</strong>, and exploring <strong>game development</strong> with C++.</p>
            </Reveal>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="projects">
          <div className="projects-header">
            <Reveal cls="reveal-left">
              <div className="projects-big-label">SELECTED<br />WORK.</div>
            </Reveal>
            <div className="projects-sub">A curated look at what I've built — with more on the way.</div>
          </div>
          {DATA.projects.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.1}>
              <div className="proj-item">
                <div className="proj-num">{p.num}</div>
                <div className="proj-content">
                  <div className="proj-cat">{p.category}</div>
                  <div className="proj-title">{p.title}</div>
                  <p className="proj-desc">{p.desc}</p>
                  <div className="proj-tags">{p.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}</div>
                </div>
                <div className="proj-action">
                  <div className="proj-year">{p.year}</div>
                  <a href={p.link} target="_blank" rel="noreferrer" className="proj-visit">
                    {p.github ? "View on GitHub ↗" : "Visit Site ↗"}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="proj-soon">More work in progress —</div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="skills">
          <div className="skills-left">
            <div className="section-label">Capabilities</div>
            <Reveal>
              <div className="skills-headline">SKILLS<br />&amp;<br />TOOLS.</div>
            </Reveal>
          </div>
          <div className="skills-right">
            <div style={{ marginBottom: "56px" }}>
              <div className="section-label">Proficiency</div>
              {DATA.skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.08} />
              ))}
            </div>
            <div>
              <div className="exploring-header">Currently Exploring</div>
              <div className="exploring-items">
                {DATA.exploring.map(e => (
                  <div key={e} className="exploring-item">
                    <span className="exploring-dot" />
                    {e}
                    <span className="exploring-badge">In Progress</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </Layout>
    </>
  );
}