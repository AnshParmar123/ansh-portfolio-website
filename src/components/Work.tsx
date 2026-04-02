import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    name: "LipSync AI",
    category: "Computer Vision",
    tech: "Python, OpenCV, NumPy",
    description:
      "A computer vision system that detects lip movements and predicts speech for non-verbal communication. Uses real-time lip landmark extraction and converts it into text.",
    image: "/images/project-lipsync.svg",
  },
  {
    name: "Smart Attendance System",
    category: "Face Recognition",
    tech: "Python, OpenCV, Face Recognition, Flask, SMTP",
    description:
      "AI-based attendance system using face recognition to eliminate proxy. Includes dashboards, CSV logs, and email alerts with images and attendance tracking.",
    image: "/images/project-attendance.svg",
  },
  {
    name: "CerebroChat",
    category: "AI Chatbot",
    tech: "Python, LLM API, FAISS, React, Firebase",
    description:
      "AI-powered chatbot for academic assistance. Generates notes, cheat sheets, answers questions, and tracks study progress using uploaded documents.",
    image: "/images/project-cerebrochat.svg",
  },
  {
    name: "InsightX",
    category: "Analytics",
    tech: "Python, Pandas, Data Analysis",
    description:
      "Customer feedback analysis system that processes CSV data to identify business gaps, suggest improvements, and optimize product strategies for better sales.",
    image: "/images/project-insightx.svg",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;
    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        pinType: !ScrollTrigger.isTouch ? "transform" : "fixed",
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      duration: 40,
      delay: 0.2,
    });
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={project.name}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tech}</p>
                <p className="work-description">{project.description}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
