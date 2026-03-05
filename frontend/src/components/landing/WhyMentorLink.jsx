import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   
import "./WhyMentorLink.css";
import projectCollaborationImg from "../../assets/projectcollaboration.png";

const WhyMentorLink = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: "Personalized Mentorship",
      description: "Get matched with mentors aligned to your goals, skills, and interests."
    },
    {
      id: 2,
      title: "Centralized Event Access",
      description: "Discover, register, and attend curated tech talks, webinars, and hackathons — all in one place."
    },
    {
      id: 3,
      title: "Growth Tracking Dashboard",
      description: "Visualize your progress through sessions, achievements, and learning paths."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    const section = document.querySelector(".why-mentorlink-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section className="why-mentorlink-section">
      <div className="why-mentorlink-container">
        
        {/* Left Text + Buttons */}
        <div className="why-mentorlink-content">
          <div className={`content-wrapper ${isVisible ? "animate-in" : ""}`}>
            <h2 className="section-title">
              Why <span className="highlight">MentorLink?</span>
            </h2>
            
            <div className="features-list">
              {features.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className={`feature-item ${isVisible ? "animate-in" : ""}`}
                  style={{ animationDelay: `${0.2 + index * 0.15}s` }}
                >
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Buttons aligned under text */}
            <div className={`cta-buttons ${isVisible ? "animate-in" : ""}`}>
              <button 
                className="connect-btn"
                onClick={() => navigate("/login")}
              >
                CONNECT
              </button>
              <button 
                className="try-btn"
                onClick={() => navigate("/login")}
              >
                LET'S TRY
              </button>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="image-right">
          <img 
            src={projectCollaborationImg} 
            alt="Project Collaboration"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyMentorLink;
