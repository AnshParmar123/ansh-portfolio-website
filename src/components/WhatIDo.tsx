import "./styles/WhatIDo.css";

const capabilities = [
  {
    index: "01",
    title: "Software systems",
    description:
      "I design and build dependable product experiences from interface to backend logic, with an emphasis on clarity, performance, and real use cases.",
    stack: ["TypeScript", "React", "Node.js", "Python", "SQL", "Astro"],
  },
  {
    index: "02",
    title: "Applied AI",
    description:
      "I turn machine-learning, automation, and computer-vision ideas into systems people can actually use, evaluate, and improve.",
    stack: ["PyTorch", "OpenCV", "Pandas", "LangChain", "Streamlit", "n8n"],
  },
];

const WhatIDo = () => {
  return (
    <section className="whatIDO" aria-labelledby="capabilities-heading">
      <div className="what-intro">
        <p className="what-eyebrow">Capabilities</p>
        <h2 id="capabilities-heading">How I make ideas tangible.</h2>
      </div>
      <div className="capability-list">
        {capabilities.map((capability) => (
          <article className="capability-row" key={capability.index}>
            <span className="capability-index">{capability.index}</span>
            <div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </div>
            <div className="capability-stack" aria-label={`${capability.title} stack`}>
              {capability.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhatIDo;
