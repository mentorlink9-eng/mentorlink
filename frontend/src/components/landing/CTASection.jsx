import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";   // ✅ add this
import './CTASection.css';
import TypingAnimation from '../ui/typing-animation/TypingAnimation';

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();  // ✅ add this

  const typingTexts = [
    "Start learning, mentoring, and growing together.",
    "Connect with industry experts and peers.",
    "Build your network and accelerate your career.",
    "Join thousands of successful professionals."
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.cta-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className={`cta-content ${isVisible ? 'animate-in' : ''}`}>
          {/* Main Title */}
          <h2 className="cta-title">Ready to Join the Journey?</h2>
          
          {/* Typing Animation */}
          <div className="cta-typing-container">
            <TypingAnimation 
              texts={typingTexts} 
              speed={60}
              deleteSpeed={30}
              delay={3000}
            />
          </div>

          {/* CTA Buttons */}
          <div className={`cta-buttons-group ${isVisible ? 'animate-in delay-1' : ''}`}>
            {/* ✅ Updated with navigation */}
            <button 
              className="student-btn"
              onClick={() => navigate("/login")}
            >
              Join as Student
            </button>
            <button 
              className="mentor-btn"
              onClick={() => navigate("/login")}
            >
              Become a Mentor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
