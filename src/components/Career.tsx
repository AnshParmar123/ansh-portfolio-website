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

const academicYears = [
  {
    year: "Year 1",
    semesters: [
      { label: "Sem 1", sgpa: "8.50" },
      { label: "Sem 2", sgpa: "8.31" },
      { label: "Sem 3", sgpa: "8.69" },
    ],
  },
  {
    year: "Year 2",
    semesters: [
      { label: "Sem 4", sgpa: "7.88" },
      { label: "Sem 5", sgpa: "8.36" },
      { label: "Sem 6", sgpa: "8.50" },
    ],
  },
  {
    year: "Year 3",
    semesters: [
      { label: "Sem 7", sgpa: "9.25" },
      { label: "Sem 8", sgpa: "8.73" },
      { label: "Sem 9", sgpa: "Ongoing" },
    ],
  },
  {
    year: "Year 4",
    semesters: [
      { label: "Sem 10", sgpa: "Upcoming" },
      { label: "Sem 11", sgpa: "Upcoming" },
      { label: "Sem 12", sgpa: "Upcoming" },
    ],
  },
  {
    year: "Year 5",
    semesters: [
      { label: "Sem 13", sgpa: "Upcoming" },
      { label: "Sem 14", sgpa: "Upcoming" },
      { label: "Sem 15", sgpa: "Upcoming" },
    ],
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
        <div className="academics-section">
          <div className="academics-header">
            <div>
              <span className="academics-eyebrow">Academic Performance</span>
              <h3>Current CGPA: 8.53 / 10</h3>
            </div>
            <p>
              Semester-wise SGPA across the integrated MBA-Tech journey so far,
              with current performance calculated from completed semesters.
            </p>
          </div>
          <div className="academics-grid">
            {academicYears.map((item) => (
              <div className="academics-card" key={item.year}>
                <h4>{item.year}</h4>
                <div className="academics-semesters">
                  {item.semesters.map((semester) => (
                    <div className="academics-semester" key={semester.label}>
                      <span>{semester.label}</span>
                      <strong>{semester.sgpa}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="interests-section">
          <div className="interests-header">
            <span className="academics-eyebrow">Beyond Academics</span>
            <h3>Personal Interests</h3>
            <p>
              Outside of building projects, I enjoy staying active through
              sports and spending time reading. These interests keep me
              competitive, curious, and balanced.
            </p>
          </div>
          <div className="interests-grid">
            <div className="interest-card">
              <h4>Sports</h4>
              <div className="interest-tags">
                <span>Football (Most)</span>
                <span>Cricket</span>
                <span>Badminton</span>
                <span>Basketball</span>
                <span>Table Tennis</span>
              </div>
            </div>
            <div className="interest-card">
              <h4>Reading</h4>
              <div className="interest-tags">
                <span>Books</span>
                <span>Learning Through Reading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
