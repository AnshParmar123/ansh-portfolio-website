import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Student</h4>
                <h5>RAIT, DY Patil University</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Currently pursuing an Integrated MBA-Tech (AIML) degree at RAIT,
              DY Patil University. Exploring opportunities in Artificial
              Intelligence, Machine Learning, and software development while
              building real-world projects.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Experience</h4>
                <h5>Practical Project Work</h5>
              </div>
              <h3>AI</h3>
            </div>
            <p>
              As a student, I have focused on building practical, real-world
              projects in AI and software development. My experience includes
              developing intelligent systems such as lip-reading models, smart
              attendance systems, and AI-based chatbots.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Currently Exploring</h4>
                <h5>AI, ML and Software Development</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              I am continuing to deepen my skills in computer vision,
              automation, intelligent applications, and scalable software while
              preparing for impactful opportunities in the industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
