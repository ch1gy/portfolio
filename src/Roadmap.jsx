import { useEffect, useRef, useState } from "react";
import Layout from "./layout";

// ── DATA ──────────────────────────────────────────────────────────────────────
const PHILOSOPHY = [
  { val: "4 hrs",      label: "Daily Study"    },
  { val: "22 mo",      label: "Full Curriculum" },
  { val: "Math first", label: "Philosophy"      },
];

const PHASES = [
  {
    num: "01",
    duration: "Week 1 → Week 3",
    title: "Intuition Before Formalism",
    desc: "Before rigorous coursework begins, geometric intuition for linear algebra, calculus, and neural networks is built through visual learning. This makes formal OCW material land properly rather than feel like a wall.",
    outcome: "Geometric intuition for linear algebra, calculus, and neural network learning established. MIT 6.S191 underway. OCW coursework begins from a position of understanding, not memorisation.",
    sections: [
      {
        label: "week 1",
        rows: [
          [
            { tag: "Mathematics",  name: "3B1B — Essence of Linear Algebra",       status: "In Progress", progress: 33, detail: "15 videos. Visual, geometric understanding of vectors, matrices, and transformations — the language neural networks are written in." },
            { tag: "Applied ML",   name: "MIT 6.S191 — Introduction to Deep Learning", status: "In Progress", progress: 20, detail: "MIT's official deep learning course. Weekly lectures and assignments run as an anchor throughout Phase 1 and 2." },
          ],
        ],
      },
      {
        label: "week 2",
        rows: [
          [
            { tag: "Mathematics",    name: "3B1B — Essence of Calculus",           detail: "11 videos. Derivatives, integrals, and the chain rule understood geometrically before they are applied formally to optimisation." },
            { tag: "Implementation", name: "torch-lab — Parallel Implementation",  status: "In Progress", progress: 15, detail: "Every concept from 6.S191 implemented from scratch in PyTorch. No gaps between theory and code." },
          ],
        ],
      },
      {
        label: "week 3",
        rows: [
          [
            { tag: "Mathematics",    name: "3B1B — Neural Networks & Backpropagation", detail: "4 videos. Bridges calculus directly into how networks learn — the chain rule applied to layered computation. Completed before OCW begins." },
            { tag: "Implementation", name: "torch-lab — Backprop from Scratch",        detail: "Manual backpropagation implemented in pure Python following the 3B1B series. Understanding before abstraction." },
          ],
        ],
      },
    ],
  },
  {
    num: "02",
    duration: "Week 4 → Month 3",
    title: "Mathematical Foundations",
    desc: "University-level mathematics through MIT OpenCourseWare — the same lectures, problem sets, and exams used in the actual MIT curriculum. Self-graded rigorously against official answer keys.",
    outcome: "Solid linear algebra foundation. Probabilistic intuition developing. 6.S191 nearing completion. Gradient descent and backpropagation understood both formally and mechanically.",
    sections: [
      {
        label: "mathematics — daily",
        rows: [
          [
            { tag: "Mathematics · MIT OCW", name: "MIT 18.06 — Linear Algebra",             detail: "Gilbert Strang's complete linear algebra course. Every lecture, problem set, and exam. The mathematical spine of all subsequent ML work." },
            { tag: "Statistics · YouTube",  name: "StatQuest — Probability & Statistics",   detail: "Runs in parallel with 18.06 to build probabilistic intuition alongside formal linear algebra." },
          ],
        ],
      },
      {
        label: "applied ml — anchor",
        rows: [
          [
            { tag: "Applied ML · MIT", name: "MIT 6.S191 — Continues + torch-lab", detail: "6.S191 continues on its weekly release schedule. torch-lab fills every gap between lectures with from-scratch implementations." },
          ],
        ],
      },
    ],
  },
  {
    num: "03",
    duration: "Month 3 → Month 6",
    title: "Completing the Mathematics Core",
    desc: "The full calculus stack — single variable through multivariable. Multivariable calculus is where the mathematics of neural networks actually lives: high-dimensional gradients, partial derivatives, and the geometry of loss surfaces.",
    outcome: "Complete mathematics core — linear algebra, single and multivariable calculus. fast.ai underway. The mathematical language of ML is now fully readable. Every operation in a neural network has a formal foundation.",
    sections: [
      {
        label: "simultaneously",
        rows: [
          [
            { tag: "Mathematics · MIT OCW",  name: "MIT 18.06 — Linear Algebra",          detail: "Completing remaining lectures and all exams. Full course finished before moving forward." },
            { tag: "Mathematics · MIT OCW",  name: "MIT 18.01 — Single Variable Calculus", detail: "Formal calculus from first principles. Begins when 18.06 reaches ~70% completion." },
            { tag: "Applied ML · Practical", name: "fast.ai — Part 1",                     detail: "Takes the ML slot after 6.S191 completes. Top-down practical deep learning — significantly more depth than the intro course." },
          ],
          [
            { tag: "Mathematics · MIT OCW", name: "MIT 18.02 — Multivariable Calculus", detail: "Begins after 18.01 reaches ~70% completion. Partial derivatives, gradient fields, and high-dimensional optimisation — the direct mathematical foundation of neural network training at depth." },
          ],
        ],
      },
    ],
  },
  {
    num: "04",
    duration: "Month 6 → Month 13",
    title: "Deep Learning at Depth",
    desc: "Stanford's graduate-level deep learning courses, formal probability theory, and the beginning of research practice. Architectures implemented from scratch. Papers read and reproduced weekly.",
    outcome: "Able to implement deep learning architectures from first principles. Reading and engaging with research papers seriously. Formal probability theory complete. The transition from engineer to researcher begins here.",
    sections: [
      {
        label: "simultaneously",
        rows: [
          [
            { tag: "Deep Learning · Stanford", name: "CS231n — Deep Learning for Computer Vision", detail: "CNNs, backpropagation, attention — implemented from scratch in NumPy. Every assignment completed in full. The gold standard deep learning course." },
            { tag: "Applied ML · Practical",   name: "fast.ai — Part 2",                           detail: "The internals of deep learning from a practical perspective. Runs alongside CS231n — the two courses complement each other directly." },
          ],
          [
            { tag: "Mathematics · MIT OCW",    name: "MIT 6.041 — Probabilistic Systems",       detail: "Formal probability theory. Distributions, inference, and Bayesian thinking — essential for understanding model behaviour at a research level." },
            { tag: "Computer Science · MIT OCW", name: "MIT 6.006 — Introduction to Algorithms", detail: "Formal algorithms and data structures. Complexity theory, graph algorithms, dynamic programming. The CS theory foundation." },
          ],
          [
            { tag: "Reading · Gilbert Strang · Free PDF", name: "Linear Algebra and Learning from Data", detail: "Written specifically to connect 18.06 to machine learning. Every concept from the linear algebra course reappears applied directly to deep learning. Read alongside CS231n as the bridge between the two tracks." },
          ],
          [
            { tag: "Research Practice", name: "Arxiv — Weekly Paper Implementation", detail: "One ML paper read and key ideas implemented in PyTorch each week. Committed publicly to torch-lab. This is the practice that develops research-level thinking." },
          ],
        ],
      },
    ],
  },
  {
    num: "05",
    duration: "Month 13 → Month 22",
    title: "Specialisation — The Intersection",
    desc: "ML applied to neuroscience and computational biology. NLP and transformer architecture alongside formal computational neuroscience and bioinformatics — the research direction this entire curriculum was built toward.",
    outcome: "A defined research direction at the intersection of machine learning, neuroscience, and biology. The capacity to contribute original work in a field that needs engineers who understand both the mathematics and the science.",
    sections: [
      {
        label: "simultaneously",
        rows: [
          [
            { tag: "Deep Learning · Stanford", name: "CS224n — NLP with Deep Learning",                   detail: "Transformers, attention mechanisms, large language models from the ground up. Completes the deep learning picture alongside CS231n." },
            { tag: "Neuroscience · Free",       name: "Neuromatch Academy — Computational Neuroscience",  detail: "World-class computational neuroscience curriculum. ML methods applied to understanding the brain. The formal intersection of the two fields." },
          ],
          [
            { tag: "Deep Learning · Free", name: "Neuromatch Academy — Deep Learning Track", detail: "A rigorous DL curriculum with a global research community. Runs alongside the neuroscience track for both depth and connection to researchers worldwide." },
            { tag: "Biology · MIT OCW",    name: "MIT — Computational Biology",              detail: "ML applied to biological systems — protein structure, genomics, drug discovery. The AlphaFold research direction formalised." },
          ],
          [
            { tag: "Reinforcement Learning · OpenAI", name: "Spinning Up in Deep RL", detail: "Rigorous reinforcement learning foundations. Core to computational neuroscience research and to long-term work on autonomous agent systems." },
          ],
        ],
      },
    ],
  },
];

const DIRECTION = {
  label: "Research Direction",
  title: "Where this leads.",
  body: "The goal is not a job title. It is the capacity to work on problems that matter — at the intersection of machine learning and biological intelligence. The curriculum is built to get there without shortcuts.",
  tags: [
    "Computational Neuroscience & Brain-Computer Interfaces",
    "ML for Biological Systems & Drug Discovery",
    "Frontier AI Research & Model Development",
    "Autonomous Agent Systems & Reinforcement Learning",
  ],
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  .rm-container { padding: 80px 48px 140px; }

  @media (min-width: 1400px) {
    .rm-container { padding: 80px 120px 140px; }
  }

  /* HEADER */
  .rm-header {
    text-align: center;
    margin-bottom: 64px;
    padding-bottom: 64px;
    border-bottom: 1px solid var(--rule);
  }
  .rm-eyebrow {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 24px;
  }
  .rm-title {
    font-family: var(--serif);
    font-size: clamp(52px, 9vw, 96px);
    font-weight: 400;
    font-style: italic;
    line-height: 1.02;
    color: var(--ink);
    margin-bottom: 20px;
  }
  .rm-title span { color: var(--red); }
  .rm-subtitle {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--mid);
    letter-spacing: 0.1em;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  /* PHILOSOPHY STRIP */
  .rm-philosophy {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--rule);
    border: 1px solid var(--rule);
    margin-bottom: 72px;
  }
  .rm-phil-item { background: var(--cream); padding: 28px 32px; text-align: center; }
  .rm-phil-val {
    font-family: var(--serif);
    font-size: 36px;
    font-weight: 400;
    font-style: italic;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 8px;
  }
  .rm-phil-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mid);
  }

  /* INTRO */
  .rm-intro {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 48px;
    margin-bottom: 72px;
    padding-bottom: 72px;
    border-bottom: 1px solid var(--rule);
    align-items: start;
  }
  .rm-intro-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mid);
    padding-top: 4px;
  }
  .rm-intro-text {
    font-family: var(--serif);
    font-size: 19px;
    line-height: 1.65;
    color: var(--ink);
  }
  .rm-intro-text em { font-style: italic; color: var(--red); }

  /* PHASE */
  .rm-phase {
    margin-bottom: 80px;
    padding-bottom: 80px;
    border-bottom: 1px solid var(--rule);
  }
  .rm-phase:last-of-type { border-bottom: none; }
  .rm-phase-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;
  }
  .rm-phase-num {
    font-family: var(--display);
    font-size: 92px;
    line-height: 1;
    color: rgba(13,13,13,0.07);
    min-width: 80px;
  }
  .rm-phase-meta { flex: 1; }
  .rm-phase-duration {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 6px;
  }
  .rm-phase-title { font-family: var(--serif); font-size: 23px; font-weight: 700; line-height: 1.2; }
  .rm-phase-desc {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--mid);
    line-height: 1.7;
    margin-top: 8px;
    max-width: 520px;
  }
  .rm-phase-divider { flex: 1; height: 1px; background: linear-gradient(to right, var(--rule), transparent); }

  /* SECTION LABEL */
  .rm-section-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mid);
    margin: 28px 0 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .rm-section-label::after { content: ''; height: 1px; flex: 1; background: var(--rule); }

  /* COURSE GRID */
  .rm-course-grid { display: grid; gap: 12px; }
  .rm-course-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rm-course-row.single { grid-template-columns: 1fr; }
  .rm-course-row.triple { grid-template-columns: 1fr 1fr 1fr; }

  /* COURSE CARD */
  .rm-course {
    border: 1px solid var(--rule);
    padding: 20px 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
    background: rgba(13,13,13,0.02);
    border-radius: 4px;
  }
  .rm-course:hover { transform: translateY(-3px); border-color: var(--ink); box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08); }
  .rm-course::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--rule); }
  .rm-course.active-now  { border-color: rgba(200,50,42,0.35); background: rgba(200,50,42,0.025); }
  .rm-course.active-now::before  { background: var(--red); }
  .rm-course.is-done::before     { background: #3a7a5a; }

  .rm-course-tag {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rm-active-badge {
    padding: 1px 7px;
    font-size: 8.5px;
    letter-spacing: 0.08em;
    font-family: var(--mono);
    border-radius: 2px;
    background: var(--red);
    color: white;
  }
  .rm-course-name { font-family: var(--serif); font-size: 15.5px; font-weight: 700; line-height: 1.35; margin-bottom: 7px; }
  .rm-course-detail { font-family: var(--mono); font-size: 11px; color: var(--mid); line-height: 1.65; }

  /* PROGRESS BAR */
  .rm-progress-row { display: flex; align-items: center; gap: 10px; margin-top: 14px; }
  .rm-progress-track { flex: 1; height: 2px; background: var(--rule); overflow: hidden; }
  .rm-progress-fill {
    height: 100%;
    background: var(--bar-color, var(--rule));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 1.2s cubic-bezier(.77, 0, .18, 1);
  }
  .rm-progress-fill.on { transform: scaleX(1); }
  .rm-progress-pct { font-family: var(--mono); font-size: 9px; color: var(--mid); min-width: 28px; text-align: right; }

  /* STATUS ROW */
  .rm-status-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 8px;
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid);
  }
  .rm-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--red); flex-shrink: 0; animation: blink 2s ease-in-out infinite; }
  .rm-status-row.is-active { color: var(--red); }
  .rm-status-row.is-done   { color: #3a7a5a; }

  /* OUTCOME */
  .rm-outcome {
    margin-top: 28px;
    padding: 18px 24px;
    border-left: 4px solid var(--rule);
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--mid);
    line-height: 1.75;
    background: rgba(13,13,13,0.015);
  }
  .rm-outcome strong { color: var(--ink); font-weight: 600; }

  /* DIRECTION */
  .rm-direction {
    margin-top: 80px;
    padding: 56px 48px;
    border: 1px solid var(--rule);
    background: var(--ink);
    border-radius: 6px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .rm-dir-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 20px; }
  .rm-dir-title { font-family: var(--serif); font-size: 34px; font-style: italic; color: rgba(255,255,255,0.9); line-height: 1.2; margin-bottom: 16px; }
  .rm-dir-body  { font-family: var(--mono); font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.75; }
  .rm-dir-tags  { display: grid; gap: 12px; }
  .rm-dir-tag   { padding: 14px 20px; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; display: flex; align-items: center; gap: 14px; }
  .rm-dir-dot   { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.25); flex-shrink: 0; }
  .rm-dir-text  { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; color: rgba(255,255,255,0.6); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .rm-intro       { grid-template-columns: 1fr; gap: 16px; }
    .rm-direction   { grid-template-columns: 1fr; }
    .rm-philosophy  { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .rm-container   { padding: 48px 24px 100px; }
    .rm-course-row, .rm-course-row.triple { grid-template-columns: 1fr; }
    .rm-phase-num   { display: none; }
    .rm-direction   { padding: 40px 24px; }
  }
`;

// ── COMPONENTS ────────────────────────────────────────────────────────────────
const ROW_CLASS = { 1: " single", 2: "", 3: " triple" };

function RmCourse({ tag, name, detail, status = "Not Started", progress = 0 }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setOn(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const barColor =
    status === "In Progress" ? "var(--red)" :
    status === "Completed"   ? "#3a7a5a"    :
    "var(--rule)";

  const cardClass = [
    "rm-course",
    status === "In Progress" ? "active-now" : "",
    status === "Completed"   ? "is-done"    : "",
  ].filter(Boolean).join(" ");

  const statusRowClass = [
    "rm-status-row",
    status === "In Progress" ? "is-active" : "",
    status === "Completed"   ? "is-done"   : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClass} ref={ref} style={{ "--bar-color": barColor }}>
      <div className="rm-course-tag">
        {tag}
        {status === "In Progress" && <span className="rm-active-badge">ACTIVE</span>}
      </div>
      <div className="rm-course-name">{name}</div>
      <div className="rm-course-detail">{detail}</div>
      <div className="rm-progress-row">
        <div className="rm-progress-track">
          <div className={`rm-progress-fill${on ? " on" : ""}`} style={{ width: `${progress}%` }} />
        </div>
        <span className="rm-progress-pct">{progress}%</span>
      </div>
      <div className={statusRowClass}>
        {status === "In Progress" && <span className="rm-status-dot" />}
        {status}
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Roadmap() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <style>{CSS}</style>
      <Layout>
        <div className="rm-container">

          <div className="rm-header">
            <p className="rm-eyebrow">Learning Roadmap · chigy.dev</p>
            <h1 className="rm-title">Structured <span>Depth</span></h1>
            <p className="rm-subtitle">
              A deliberate, self-directed curriculum toward research-level machine learning —
              built on mathematical foundations, serious coursework, and real implementation.
            </p>
          </div>

          <div className="rm-philosophy">
            {PHILOSOPHY.map(p => (
              <div key={p.label} className="rm-phil-item">
                <div className="rm-phil-val">{p.val}</div>
                <div className="rm-phil-label">{p.label}</div>
              </div>
            ))}
          </div>

          <div className="rm-intro">
            <div className="rm-intro-label">Approach</div>
            <div className="rm-intro-text">
              This roadmap follows a single principle: <em>understand before you apply.</em> Every ML
              course is preceded by the mathematics that makes it legible. Every concept is implemented
              from scratch before being used as a tool. The goal is not to consume AI — it is to work
              at the level where AI is built.
            </div>
          </div>

          {PHASES.map(phase => (
            <div key={phase.num} className="rm-phase">
              <div className="rm-phase-header">
                <div className="rm-phase-num">{phase.num}</div>
                <div className="rm-phase-meta">
                  <div className="rm-phase-duration">{phase.duration}</div>
                  <div className="rm-phase-title">{phase.title}</div>
                  <div className="rm-phase-desc">{phase.desc}</div>
                </div>
                <div className="rm-phase-divider" />
              </div>

              {phase.sections.map(section => (
                <div key={section.label}>
                  <div className="rm-section-label">{section.label}</div>
                  <div className="rm-course-grid">
                    {section.rows.map((row, ri) => (
                      <div key={ri} className={`rm-course-row${ROW_CLASS[row.length] ?? ""}`}>
                        {row.map(course => (
                          <RmCourse key={course.name} {...course} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="rm-outcome">
                <strong>Phase outcome:</strong> {phase.outcome}
              </div>
            </div>
          ))}

          <div className="rm-direction">
            <div className="rm-dir-left">
              <div className="rm-dir-label">{DIRECTION.label}</div>
              <div className="rm-dir-title">{DIRECTION.title}</div>
              <div className="rm-dir-body">{DIRECTION.body}</div>
            </div>
            <div className="rm-dir-tags">
              {DIRECTION.tags.map(t => (
                <div key={t} className="rm-dir-tag">
                  <div className="rm-dir-dot" />
                  <div className="rm-dir-text">{t}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Layout>
    </>
  );
}
