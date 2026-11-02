import { useState } from "react";
import { SignalArchitectureCanvas } from "./SignalArchitecture";
import "./styles/Showcase.css";

const projects = [
  { number: "01", name: "CascadeSignal", type: "Quantitative research", metric: "143 / 143", label: "major cascades detected", desc: "Early-warning intelligence for DeFi liquidation cascades, using a self-exciting Hawkes process over 73,000+ events.", link: "https://github.com/AnshParmar123/CascadeSignal" },
  { number: "02", name: "LipSync AI", type: "Computer vision", metric: "Real-time", label: "face landmark pipeline", desc: "A live lip-reading and emotion-analysis system built around MediaPipe landmarks and a bidirectional GRU.", link: null },
  { number: "03", name: "InsightX", type: "AI analytics", metric: "LLM", label: "complaint intelligence", desc: "An analytics dashboard that converts customer complaints into category, location, and sentiment insight.", link: "https://github.com/AnshParmar123/insight-x" },
];

const Showcase = () => {
  const [active, setActive] = useState(0);
  const project = projects[active];
  return <main className="showcase">
    <div className="showcase-noise" />
    <header className="showcase-nav">
      <a href="#top" className="showcase-brand">ANSH<span>PARMAR</span></a>
      <nav><a href="#work">Work</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav>
      <a className="showcase-resume" href="/documents/Ansh_Parmar_Resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a>
    </header>

    <section className="showcase-hero" id="top">
      <div className="showcase-hero-copy">
        <p className="showcase-kicker">AI/ML builder · Full-stack developer</p>
        <h1><span>ANSH</span><span className="showcase-depth">PARMAR</span></h1>
        <p className="showcase-lead">I build intelligent systems that turn complex signals into useful decisions.</p>
        <div className="showcase-actions"><a href="#work">Explore selected work <b>↓</b></a><a href="mailto:p.anshu2005@gmail.com">Start a conversation <b>↗</b></a></div>
        <dl className="showcase-stats"><div><dt>CGPA</dt><dd>8.7</dd></div><div><dt>Focus</dt><dd>AI/ML</dd></div><div><dt>Projects</dt><dd>04</dd></div></dl>
      </div>
      <div className="showcase-hero-visual"><SignalArchitectureCanvas /><div className="showcase-visual-caption"><span>Live model</span><strong>Signal architecture</strong><em>Move your cursor</em></div></div>
    </section>

    <section className="showcase-manifesto"><p>From <span>computer vision</span> to <span>automation</span> and <span>research systems</span>, I work where data, engineering, and real-world usefulness meet.</p></section>

    <section className="showcase-work" id="work">
      <div className="showcase-section-head"><p>Selected work / 2025—26</p><h2>Evidence over <span>noise.</span></h2></div>
      <div className="showcase-project-shell">
        <div className="showcase-project-list">{projects.map((item, index) => <button key={item.name} className={index === active ? "is-active" : ""} onClick={() => setActive(index)}><span>{item.number}</span><strong>{item.name}</strong><em>{item.type}</em></button>)}</div>
        <article className="showcase-project-detail"><p className="showcase-project-type">{project.type}</p><h3 className="showcase-depth">{project.name}</h3><p>{project.desc}</p><div className="showcase-metric"><strong>{project.metric}</strong><span>{project.label}</span></div>{project.link ? <a href={project.link} target="_blank" rel="noreferrer">View repository ↗</a> : <span className="showcase-muted">Repository available on request</span>}</article>
      </div>
    </section>

    <section className="showcase-experience" id="experience"><div className="showcase-section-head"><p>Experience / education</p><h2>Built while <span>learning.</span></h2></div><div className="showcase-rows">
      <article><span>2026</span><div><h3>Full Stack Development Intern</h3><p>DecodeLabs · Virtual internship</p></div><a href="/documents/decodelabs-full-stack-internship-certificate.pdf" target="_blank" rel="noreferrer">Credential ↗</a></article>
      <article><span>2026</span><div><h3>AI & Web Developer Intern</h3><p>3DOTS Creative Solutions · Remote</p></div><span>Production web systems & automation</span></article>
      <article><span>2026</span><div><h3>Data Analytics Intern</h3><p>DY Patil University</p></div><a href="/documents/dy-patil-internship-certificate.pdf" target="_blank" rel="noreferrer">Credential ↗</a></article>
    </div></section>

    <section className="showcase-contact" id="contact"><p>Have an interesting problem?</p><h2>Let’s build<br /><span>something useful.</span></h2><a href="mailto:p.anshu2005@gmail.com">p.anshu2005@gmail.com ↗</a><div><a href="https://github.com/AnshParmar123" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/ansh-parmar/" target="_blank" rel="noreferrer">LinkedIn</a></div></section>
  </main>;
};

export default Showcase;
