import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import logoImage from "../../../assets/mentorlink-logo.png";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (path.startsWith("/#")) {
      // Scroll to section on landing page
      if (window.location.pathname === "/") {
        const el = document.getElementById(path.replace("/#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(path.replace("/#", ""));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <img src={logoImage} alt="MentorLink Logo" className="footer-logo-image" />
            <span className="footer-logo-text">MentorLink</span>
          </div>
          <p className="footer-description">
            Bridging the gap between learners and leaders.<br />
            Crafted and built with love by team KHUB
          </p>

          {/* Social Media Icons - only real links */}
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/mentorlink" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://github.com/mentorlink" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>

          {/* CTA */}
          <div className="footer-cta">
            <p className="cta-text">Let us do it! -</p>
            <button className="get-started-footer-btn" onClick={() => navigate("/signup")}>Get Started</button>
          </div>
        </div>

        {/* Right Section */}
        <div className="footer-links">
          <div className="footer-column">
            <h3 className="footer-column-title">Company</h3>
            <ul className="footer-link-list">
              <li><a href="/#about" className="footer-link" onClick={(e) => handleNavClick(e, "/#about")}>About us</a></li>
              <li><a href="/contact" className="footer-link" onClick={(e) => handleNavClick(e, "/contact")}>Contact</a></li>
              <li><a href="/contact" className="footer-link" onClick={(e) => handleNavClick(e, "/contact")}>Partnership</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Product</h3>
            <ul className="footer-link-list">
              <li><a href="/mentors" className="footer-link" onClick={(e) => handleNavClick(e, "/mentors")}>Find a mentor</a></li>
              <li><a href="/signup" className="footer-link" onClick={(e) => handleNavClick(e, "/signup")}>Become a mentor</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">Support</h3>
            <ul className="footer-link-list">
              <li><a href="/faqs" className="footer-link" onClick={(e) => handleNavClick(e, "/faqs")}>FAQs</a></li>
              <li><a href="/contact" className="footer-link" onClick={(e) => handleNavClick(e, "/contact")}>Help center</a></li>
              <li><a href="/terms" className="footer-link" onClick={(e) => handleNavClick(e, "/terms")}>Terms of service</a></li>
              <li><a href="/privacy" className="footer-link" onClick={(e) => handleNavClick(e, "/privacy")}>Privacy policy</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MentorLink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
