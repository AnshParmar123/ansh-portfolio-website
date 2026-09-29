import { useState } from "react";
import type { FormEvent } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = "idle" | "submitting" | "success" | "error";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (message.trim().length < 10) {
      next.message = "Message should be at least 10 characters.";
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company,
        }),
      });
      const body = await response.json();

      if (response.ok) {
        setStatus("success");
        setStatusMessage("Message sent — thanks for reaching out! I'll reply by email.");
        setName("");
        setEmail("");
        setMessage("");
        setCompany("");
        setFieldErrors({});
      } else {
        setStatus("error");
        const details = body?.error?.details as string[] | undefined;
        setStatusMessage(
          details && details.length
            ? details.join(" ")
            : "Something went wrong sending that. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setStatusMessage("Couldn't reach the server — please email me directly instead.");
    }
  };

  return (
    <div className="contact-box contact-form-box">
      <h4>Send a message</h4>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form-honeypot" aria-hidden="true">
          <label htmlFor="cf-company">Company</label>
          <input
            id="cf-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>
        <div className="form-row">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            name="message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
          />
          {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
        </div>

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send Message"}
        </button>

        {statusMessage && (
          <p className={`form-status form-status-${status}`} role="status">
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a
                href="mailto:p.anshu2005@gmail.com"
                data-cursor="disable"
              >
                p.anshu2005@gmail.com
              </a>
            </p>
            <p className="contact-note">
              Open to internships, AI/ML opportunities, and collaborative
              product building.
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/AnshParmar123"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/ansh-parmar/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="mailto:p.anshu2005@gmail.com"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
            <a
              href="/documents/Ansh_Parmar_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Resume <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Built and personalized <br /> by <span>Ansh Parmar</span>
            </h2>
            <p className="contact-cta">
              Open to internships, AI/ML roles, software development
              opportunities, and product-focused collaborations.
            </p>
            <h5>
              <MdCopyright /> 2026
            </h5>
            <p className="contact-tagline" lang="sa">
              कृष्णं वन्दे जगद्गुरुम् °•👁U👁•° 🌸
            </p>
          </div>
        </div>
        <div className="contact-form-row">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
