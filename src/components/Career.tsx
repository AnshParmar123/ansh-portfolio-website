import "./styles/Career.css";

const timelineItems = [
  {
    title: "Integrated MBA-Tech",
    subtitle: "RAIT, DY Patil University",
    marker: "NOW",
    description:
      "Pursuing an AIML-focused degree while strengthening both business thinking and technical problem-solving for applied AI products.",
  },
  {
    title: "AI/ML Project Builder",
    subtitle: "Computer Vision and Automation",
    marker: "FOCUS",
    description:
      "Building systems around face recognition, lip movement analysis, feedback intelligence, and academic assistants with scalable, real-world use cases.",
  },
  {
    title: "Open to Opportunities",
    subtitle: "AI, ML and Software Development",
    marker: "NEXT",
    description:
      "Exploring internships and collaborative roles where I can keep learning, ship meaningful products, and contribute to intelligent software systems.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>Education & Focus</h2>
        <div className="career-info">
          <div className="career-timeline" aria-hidden="true">
            <div className="career-line"></div>
            <div className="career-dot"></div>
          </div>
          {timelineItems.map((item) => (
            <div className="career-info-box" key={item.marker}>
              <div className="career-info-left">
                <h4>{item.title}</h4>
                <h5>{item.subtitle}</h5>
              </div>
              <div className="career-info-center">
                <span>{item.marker}</span>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
