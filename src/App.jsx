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
const DUCK_CURSOR_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAEVklEQVR4nO2WS6hVVRjHf+tbr3POvde4+SpfpPbQhAhCMshKbBA0KXpgULMGjqWgeTVvVoHgRISooEkjB0EJDqSICKKHaEp49aYe73nssx9rfQ1MTdHj9SQ48T/ag+/x+/577W8vuKs7LDNJ0jvrt+gLa9bSHVlePfL1RDUuSSZJmu0os80pQrv3f3oD4CZJ6lRKlIqZ0gPw/qaNumPlcg6J571vvrslR8YCbNu2TCUVSI6ULlOFLtMF6PRpTmqLou4DsMJGNhSGX4ZztzzMWNoDnz6lS90xAGy5mign2PT4LCOFqugwFWuCG9HbB8WRJfz9cJ81e5Siv57NOw4uyomxDixxEalbfHboFHv3zxmA+W+XqjfClB1R54bY96RXplj9Yo9VQelWSjTtRc5/E4BReYGaguncAUoAEhFUSKagtJbgZ8i2z5l2G1IgpgWSHU0GsH/PVt3Smee+fIGua3OmOU+3pby8fQkvbW9p5YaM4gKtOqIKaMXIdompRdPqY+tAq/IUEiYD6J48y8/945ycgtScZ+XT6/BtYWhrjBmieEJpyTRkwCWLoowo0NJDTgxsom+byQDm9H7ytCN3FG0GzLamwAxBHartf8M71y0kJJK1lOLxyS4aYOxJ/WrvdnV6FEuFyQFRIZnyqrYXlQk50RhP6RocQx7duJPDv0be2P3l2B5jD2HNNK3kwRYoFkwJ5P9EXHlW0wAWnwRvKoL9De3efNGOBWilkk6TGFihtIHAkCc2L7tubDYOyLgMsIJExTNb2/z0+Qad51l2vrbvuk6MBZBQMDABpzVJKkISsqn48Ycev/9xjjJlSAaDIkAy0MjFom+9+QAMaiRHQhpM5kDTNHhVFEVV0WxIzTRae4YXMi440DbIAM0WjENMRuQsklqIDDB2gFLesMet/YxMjYs9kqmILSGTUE0YGYGAGo/JEasByRGyu2iL3vgsjAUw5trXZsnawjtHk0swBtSg6jAqqBFEG9SMMDHRVJmT5+bo1qtukwMqBH8PSc+RtcR5hSwgitGEQcFkMAnjA70qkP1GvL33xkOO6/fFJ0/qlPxJsjWdMpKMgIwu7gMihQ3YbBCgtjWWAbGaQbUD7jTn9CF27T48+R5oV5HgPH0rNDYztJ6YA8Y0KDViFJFMzAW+XE7jE2XoIblBcNTEceVvDlCGAY0vsdnRqRsSbZAGSQ5rCkItLPg2tfVEmUelweZIyEOGrk2r1JsCLOrS8O7za/TtrQVBhlRpCR9/P81HB49ezt37+qw+t34FgS5ZaubtI2z9YLz1l7SoS6nNwlSdiI0F04BebVwhMzTxNMktYDUT9MaL51ot6itQhJ6PBIFEIsnV3F4LYjUNJjIMA5K5TQAf7npM14XzLG1O8dfxEgwkgQfsg5djDuxeq7G3wLETZ3E5A8IF1789AEYiyc8wCG3OFH1Kozib0M4VB/ywprJrmMtdjGTUwMDOAKcXDXFXd1T/AAGb77Os7yKZAAAAAElFTkSuQmCC';

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