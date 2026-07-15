import "./styles/Career.css";
import "./styles/Experience.css";

const experienceItems = [
  {
    title: "Intern, Intelligent Data Analytics",
    subtitle: "DY Patil University",
    marker: "MAY '26",
    description:
      "Worked on data analytics workflows using Python, Pandas, and SQL to clean, explore, and visualize datasets. Built reusable analysis scripts and summarized findings into clear reports that supported the team's data-driven decisions.",
  },
];

const Experience = () => {
  return (
    <div className="experience-section section-container" id="experience">
      <div className="experience-container">
        <h2>Experience</h2>
        <div className="career-info">
          <div className="career-timeline" aria-hidden="true">
            <div className="career-line"></div>
            <div className="career-dot"></div>
          </div>
          {experienceItems.map((item) => (
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

export default Experience;
