import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para about-lead">
          I am Ansh Parmar, an AIML student pursuing an Integrated MBA-Tech
          degree from RAIT, DY Patil University. I am passionate about building
          intelligent systems that combine machine learning with real-world
          applications.
        </p>
        <p className="para about-secondary">
          My work focuses on computer vision, automation, and AI-driven problem
          solving, where I aim to create impactful and scalable solutions. I
          enjoy experimenting with new technologies and continuously improving
          my technical and analytical skills.
        </p>
        <p className="para about-secondary">
          I am currently exploring opportunities in AI, machine learning, and
          software development.
        </p>
        <div className="about-points">
          <div>
            <span>Focus</span>
            Computer vision, intelligent automation, and practical AI systems
          </div>
          <div>
            <span>Strength</span>
            Translating technical ideas into usable, real-world products
          </div>
          <div>
            <span>Goal</span>
            Build meaningful software that is intelligent, scalable, and useful
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
