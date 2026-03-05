import React from 'react';
import { useNavigate } from "react-router-dom";   // ✅ add this
import './Hero.css';
import TypingAnimation from '../ui/typing-animation/TypingAnimation';
import heroImage from '../../assets/heroillustation.png';

const Hero = () => {
  const typingTexts = [
    "Connect with the right people",
    "Access the right events", 
    "Grow smarter, all in one place"
  ];

  const navigate = useNavigate();  // ✅ add this

  return (
    <section className="hero" id="hero">
      
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Mentorship Made Effortless</h1>
          
          <div className="hero-typing">
            <TypingAnimation 
              texts={typingTexts} 
              speed={80}
              deleteSpeed={40}
              delay={2500}
            />
          </div>

          <h2 className="hero-subtitle">Your Gateway to Guided Growth</h2>

          <p className="hero-description">
            MentorLink connects students, mentors, and organizers in one smart space.
          </p>

          {/* ✅ Updated button with navigate */}
          <button 
            className="hero-cta"
            onClick={() => navigate("/login")}
          >
            Explore Now
          </button>
        </div>

        <div className="hero-illustration-container">
          <img src={heroImage} alt="Mentor and student working together with laptop" className="hero-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
