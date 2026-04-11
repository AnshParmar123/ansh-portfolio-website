import {
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="mailto:anshudayparmar@gmail.com" data-cursor="disable">
            <FaEnvelope />
          </a>
        </span>
        <span>
          <a
            href="https://github.com/AnshParmar123"
            target="_blank"
            rel="noreferrer"
            data-cursor="disable"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/ansh-parmar/"
            target="_blank"
            rel="noreferrer"
            data-cursor="disable"
          >
            <FaLinkedinIn />
          </a>
        </span>
      </div>
      <a
        className="resume-button"
        href="/documents/Ansh_Parmar_Resume.pdf"
        target="_blank"
        rel="noreferrer"
        data-cursor="disable"
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
