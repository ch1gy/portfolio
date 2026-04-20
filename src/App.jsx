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
  body { background: var(--cream); color: var(--ink); font-family: var(--serif); overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0; z-index: 1000; pointer-events: none; opacity: .03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px;
  }


  /* ── DUCK CURSOR ── */
  .duck-mode * { cursor: none !important; }
  .duck-cursor {
    position: fixed; z-index: 99999; pointer-events: none;
    width: 32px; height: 32px;
    image-rendering: pixelated;
    transform: translate(-4px, -4px);
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
  .btn-primary { font-family: var(--mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; background: var(--ink); color: var(--cream); border: none; padding: 14px 28px; transition: background .2s; }
  .btn-primary:hover { background: var(--red); }
  .btn-text { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--mid); background: none; border: none; transition: color .2s; }
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



// ── DUCK CURSOR ───────────────────────────────────────────────────────────────
const DUCK_CURSOR_SRC = 'data:image/png;base64,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';

function DuckCursor({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const move = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [active]);

  if (!active) return null;

  return (
    <img
      ref={ref}
      src={DUCK_CURSOR_SRC}
      alt=""
      className="duck-cursor"
      style={{ position: 'fixed', left: -100, top: -100 }}
    />
  );
}

// ── DUCK ──────────────────────────────────────────────────────────────────────
const DUCK_IMGS = {
  back:  'data:image/png;base64,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',
  front: 'data:image/png;base64,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',
  right: 'data:image/png;base64,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',
};

function Duck({ onActivate }) {
  const [state, setState]   = useState('hidden');
  const [edge, setEdge]     = useState('left');
  const [frame, setFrame]   = useState('front');
  const [pos, setPos]       = useState('50%');
  const timerRef            = useRef(null);
  const SIZE                = 48;

  const scheduleNext = () => {
    const delay = 2000 + Math.random() * 4000;
    timerRef.current = setTimeout(startSequence, delay);
  };

  const startSequence = () => {
    const edges = ['left', 'right', 'bottom', 'top'];
    const chosen = edges[Math.floor(Math.random() * edges.length)];
    const randPos = `${15 + Math.random() * 70}%`;
    setEdge(chosen);
    setPos(randPos);
    // sprite direction: left edge = right sprite, right = right flipped, top/bottom = front
    setFrame(chosen === 'left' ? 'right' : chosen === 'right' ? 'right' : chosen === 'top' ? 'front' : 'front');
    setState('peeking');

    timerRef.current = setTimeout(() => {
      setState('watching');
      const watchTime = 1200 + Math.random() * 1800;
      timerRef.current = setTimeout(() => {
        setState('leaving');
        timerRef.current = setTimeout(() => {
          setState('hidden');
          scheduleNext();
        }, 500);
      }, watchTime);
    }, 500);
  };

  useEffect(() => {
    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, []);

  if (state === 'hidden') return null;

  const base = {
    position: 'fixed',
    zIndex: 9990,
    pointerEvents: 'none',
    imageRendering: 'pixelated',
    width: SIZE,
    height: 'auto',
    transition: 'transform 0.45s cubic-bezier(.4,0,.2,1), opacity 0.3s',
  };

  const styles = {
    left: {
      peeking: { ...base, left: 0, top: pos, transform: 'translateX(-70%)', opacity: 1 },
      watching:{ ...base, left: 0, top: pos, transform: 'translateX(6px)',   opacity: 1 },
      leaving: { ...base, left: 0, top: pos, transform: 'translateX(-100%)', opacity: 0 },
    },
    right: {
      peeking: { ...base, right: 0, top: pos, transform: 'translateX(70%) scaleX(-1)',  opacity: 1 },
      watching:{ ...base, right: 0, top: pos, transform: 'translateX(-6px) scaleX(-1)', opacity: 1 },
      leaving: { ...base, right: 0, top: pos, transform: 'translateX(100%) scaleX(-1)', opacity: 0 },
    },
    bottom: {
      peeking: { ...base, bottom: 0, left: pos, transform: 'translateY(70%)',  opacity: 1 },
      watching:{ ...base, bottom: 0, left: pos, transform: 'translateY(-6px)', opacity: 1 },
      leaving: { ...base, bottom: 0, left: pos, transform: 'translateY(100%)', opacity: 0 },
    },
    top: {
      peeking: { ...base, top: 0, left: pos, transform: 'translateY(-70%) scaleY(-1)',  opacity: 1 },
      watching:{ ...base, top: 0, left: pos, transform: 'translateY(6px) scaleY(-1)',   opacity: 1 },
      leaving: { ...base, top: 0, left: pos, transform: 'translateY(-100%) scaleY(-1)', opacity: 0 },
    },
  };

  return (
    <img
      src={DUCK_IMGS[frame]}
      alt="duck"
      title="🦆"
      style={{ ...styles[edge][state], cursor: 'pointer', pointerEvents: 'all' }}
      onClick={onActivate}
    />
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [duckMode, setDuckMode] = useState(false);

  return (
    <>
      <style>{FONTS + CSS}</style>
      {duckMode && <style>{'* { cursor: none !important; }'}</style>}
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

        <Duck onActivate={() => setDuckMode(true)} />
        <DuckCursor active={duckMode} />
      </Layout>
    </>
  );
}