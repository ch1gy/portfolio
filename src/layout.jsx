import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DATA = {
  email: "hello@chigy.dev",
  github: "https://github.com/ch1gy",
  cs50cert: "https://certificates.cs50.io/3b57465d-359b-4f43-bd22-1fd0990c31cf.pdf?size=letter",
};

// ── SCROLL HELPER ─────────────────────────────────────────────────────────────
export function goTo(id, closeMenu) {
  if (closeMenu) closeMenu();
  setTimeout(() => {
    if (id === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, closeMenu ? 420 : 0);
}

const NAV_LINKS = [
  { label: "About",   id: "about"    },
  { label: "Work",    id: "projects" },
  { label: "Skills",  id: "skills"   },
  { label: "Contact", id: "contact"  },
];

// ── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX + "px";
        dot.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + "px";
        ring.current.style.top  = ringPos.current.y + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ navRef }) {
  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-left">Issue No. 003 — 2026</div>
      <button className="nav-logo" onClick={() => goTo("home")}>
        CHIRAAG BAROT
      </button>
      <div className="nav-right">
        {NAV_LINKS.map(l => (
          <button key={l.id} className="nav-link" onClick={() => goTo(l.id)}>
            {l.label}
          </button>
        ))}
        <div className="nav-avail">
          <span className="avail-dot" />Available
        </div>
      </div>
    </nav>
  );
}

// ── MOBILE MENU ───────────────────────────────────────────────────────────────
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        className={`fold-btn${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <div className="fold-lines">
          <div className="fold-line fold-line-1" />
          <div className="fold-line fold-line-2" />
        </div>
      </button>

      <div className={`mobile-panel${open ? " open" : ""}`}>
        <nav className="mobile-panel-links">
          {NAV_LINKS.map(l => (
            <button
              key={l.id}
              className="mobile-panel-link"
              onClick={() => goTo(l.id, close)}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="mobile-panel-bottom">
          <a href={`mailto:${DATA.email}`} className="mobile-panel-email">
            {DATA.email}
          </a>
          <div className="mobile-panel-avail">
            <span className="avail-dot" />available
          </div>
        </div>
      </div>
    </>
  );
}

// ── SCROLL TO TOP ─────────────────────────────────────────────────────────────
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      className={`scroll-top${show ? "" : " hidden"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer" id="contact">
      <div>
        <h2 className="footer-big">LET'S<br /><span className="red">WORK.</span></h2>
        <a href={`mailto:${DATA.email}`} className="footer-email">{DATA.email}</a>
      </div>
      <div className="footer-right">
        <div className="footer-links">
          <a href={DATA.github}   target="_blank" rel="noreferrer" className="footer-link">GitHub ↗</a>
          <a href={DATA.cs50cert} target="_blank" rel="noreferrer" className="footer-link">CS50 Certificate ↗</a>
        </div>
        <div className="footer-copy">© 2026 — Chiraag Barot</div>
      </div>
      <div className="footer-bottom">
        <span className="footer-bottom-left">
          CHIRAAG BAROT — SOFTWARE ENGINEER — NAIROBI
        </span>
      </div>
    </footer>
  );
}

// ── LAYOUT CSS ────────────────────────────────────────────────────────────────
const LAYOUT_CSS = `

  /* ── CUSTOM CURSOR ── */
  .cursor {
    position: fixed; z-index: 9999; pointer-events: none;
    width: 12px; height: 12px;
    background: var(--red); border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width .3s, height .3s;
    mix-blend-mode: multiply;
  }
  .cursor-ring {
    position: fixed; z-index: 9998; pointer-events: none;
    width: 40px; height: 40px;
    border: 1px solid var(--ink); border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width .35s, height .35s, border-color .3s;
  }
  body:has(a:hover) .cursor,
  body:has(button:hover) .cursor { width: 32px; height: 32px; }
  body:has(a:hover) .cursor-ring,
  body:has(button:hover) .cursor-ring { width: 64px; height: 64px; border-color: var(--red); }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 500;
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; padding: 20px 48px;
    border-bottom: 1px solid var(--rule);
    background: rgba(242,237,228,0.92);
    backdrop-filter: blur(12px);
  }
  .nav-left { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .12em; text-transform: uppercase; }
  .nav-logo { font-family: var(--display); font-size: 22px; letter-spacing: .05em; text-align: center; color: var(--ink); background: none; border: none; cursor: none; }
  .nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 32px; }
  .nav-link { font-family: var(--mono); font-size: 10px; color: var(--mid); letter-spacing: .1em; text-transform: uppercase; background: none; border: none; cursor: none; transition: color .2s; }
  .nav-link:hover { color: var(--red); }
  .nav-avail { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 10px; color: var(--red); letter-spacing: .1em; }
  .avail-dot { width: 5px; height: 5px; background: var(--red); border-radius: 50%; animation: blink 2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }

  /* ── CORNER FOLD BUTTON ── */
  .fold-btn { display: none; position: fixed; top: 0; right: 0; z-index: 600; width: 64px; height: 64px; cursor: none; background: none; border: none; }
  .fold-btn::before { content: ''; position: absolute; top: 0; right: 0; border-style: solid; border-width: 0 64px 64px 0; border-color: transparent var(--ink) transparent transparent; }
  .fold-lines { position: absolute; top: 10px; right: 8px; display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
  .fold-line { height: 1.5px; background: var(--cream); transform-origin: right center; transition: transform .35s ease, width .3s ease; }
  .fold-line-1 { width: 18px; }
  .fold-line-2 { width: 12px; }
  .fold-btn.open .fold-line-1 { width: 16px; transform: rotate(45deg) translateY(4px); }
  .fold-btn.open .fold-line-2 { width: 16px; transform: rotate(-45deg) translateY(-4px); }

  /* ── MOBILE PANEL ── */
  .mobile-panel {
    position: fixed; inset: 0; z-index: 550;
    background: var(--ink);
    transform: translateX(100%);
    transition: transform .5s cubic-bezier(.77,0,.18,1);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 64px 40px 56px;
  }
  .mobile-panel.open { transform: translateX(0); }
  .mobile-panel-links { display: flex; flex-direction: column; margin-bottom: 56px; }
  .mobile-panel-link {
    font-family: var(--display); font-size: clamp(48px,12vw,80px);
    color: rgba(255,255,255,0.2); background: none; border: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    text-align: left; padding: 20px 0; cursor: none;
    opacity: 0; transform: translateX(32px);
    transition: opacity .4s ease, transform .4s ease, color .2s;
  }
  .mobile-panel.open .mobile-panel-link { opacity: 1; transform: translateX(0); }
  .mobile-panel.open .mobile-panel-link:nth-child(1) { transition-delay: .15s; }
  .mobile-panel.open .mobile-panel-link:nth-child(2) { transition-delay: .22s; }
  .mobile-panel.open .mobile-panel-link:nth-child(3) { transition-delay: .29s; }
  .mobile-panel.open .mobile-panel-link:nth-child(4) { transition-delay: .36s; }
  .mobile-panel-link:hover { color: rgba(255,255,255,0.9); }
  .mobile-panel-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
  .mobile-panel-email { font-family: var(--mono); font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: .08em; text-decoration: none; opacity: 0; transition: opacity .4s ease .45s; }
  .mobile-panel.open .mobile-panel-email { opacity: 1; }
  .mobile-panel-avail { font-family: var(--mono); font-size: 10px; color: var(--red); letter-spacing: .08em; display: flex; align-items: center; gap: 8px; opacity: 0; transition: opacity .4s ease .5s; }
  .mobile-panel.open .mobile-panel-avail { opacity: 1; }

  /* ── SCROLL TO TOP ── */
  .scroll-top {
    position: fixed; bottom: 32px; right: 32px; z-index: 150;
    width: 44px; height: 44px; background: var(--ink); color: var(--cream);
    border: none; cursor: none; font-family: var(--mono); font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: opacity .3s, transform .3s;
  }
  .scroll-top.hidden { opacity: 0; transform: translateY(12px); pointer-events: none; }

  /* ── FOOTER ── */
  .footer { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .footer-big { font-family: var(--display); font-size: clamp(64px,9vw,128px); line-height: .85; margin-bottom: 32px; }
  .footer-big .red { color: var(--red); }
  .footer-email { font-size: 20px; font-style: italic; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--ink); padding-bottom: 2px; transition: color .2s; }
  .footer-email:hover { color: var(--red); }
  .footer-right { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; gap: 16px; }
  .footer-links { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .footer-link { font-family: var(--mono); font-size: 11px; color: var(--mid); text-decoration: none; letter-spacing: .08em; transition: color .2s; }
  .footer-link:hover { color: var(--red); }
  .footer-copy { font-family: var(--mono); font-size: 10px; color: var(--rule); letter-spacing: .08em; margin-top: 8px; }
  .footer-bottom { grid-column: 1 / -1; border-top: 1px solid var(--rule); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
  .footer-bottom-left { font-family: var(--display); font-size: 13px; color: var(--mid); letter-spacing: .1em; }

  /* ── MAIN WRAPPER ── */
  main { display: block; width: 100%; max-width: 100vw; overflow-x: hidden; }

  /* ── RESPONSIVE: NAV / FOOTER / MOBILE ── */
  @media (min-width: 1400px) {
    .nav { padding: 20px 120px; }
    .footer { padding: 80px 120px; }
  }
  @media (max-width: 768px) {
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
    .nav { padding: 14px 20px; grid-template-columns: 1fr auto; }
    .nav-left, .nav-right { display: none; }
    .nav-logo { text-align: left; font-size: 18px; }
    .fold-btn { display: block; }
    .footer { grid-template-columns: 1fr; padding: 48px 20px; gap: 32px; }
    .footer-big { font-size: clamp(48px, 14vw, 72px); }
    .footer-right { align-items: flex-start; }
    .footer-links { align-items: flex-start; }
    .footer-bottom { flex-direction: column; gap: 8px; align-items: flex-start; }
    .footer-bottom-left { font-size: 9px; }
    .footer-email { font-size: 16px; word-break: break-all; }
    .scroll-top { right: 20px; bottom: 20px; }
  }
  @media (min-width: 769px) {
    .fold-btn, .mobile-panel { display: none; }
  }
`;

// ── LAYOUT ────────────────────────────────────────────────────────────────────
export default function Layout({ children }) {
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <Cursor />
      <MobileMenu />
      <ScrollTop />
      <Nav navRef={navRef} />
      <div style={{ height: navHeight }} />
      <main>{children}</main>
      <Footer />
    </>
  );
}