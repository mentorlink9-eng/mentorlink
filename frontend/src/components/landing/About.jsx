import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  const aboutItems = [
    { 
      id: 1,
      title: "Live Events & Webinars", 
      description: "Join exclusive learning sessions, Q&As, and industry-led workshops with top professionals.",
      image: "src/assets/liveeventswebinars.png",
      color: "#FF6B6B"
    },
    { 
      id: 2,
      title: "One-on-One Mentorship", 
      description: "Connect with experienced mentors for personalized guidance and career advice.",
      image: "src/assets/oneononementorship.png",
      color: "#4ECDC4"
    },
    { 
      id: 3,
      title: "Progress Tracking", 
      description: "Set learning goals, track your achievements, and grow with your mentor.",
      image: "src/assets/progresstracking.png",
      color: "#45B7D1"
    },
    { 
      id: 4,
      title: "Career Growth", 
      description: "Accelerate your professional development with tailored guidance and mentorship.",
      image: "src/assets/careergrowth.png",
      color: "#96CEB4"
    },
    { 
      id: 5,
      title: "Global Network", 
      description: "Connect with professionals and peers from around the world in your field.",
      image: "src/assets/globalnetwork.png",
      color: "#FFEAA7"
    },
    { 
      id: 6,
      title: "Skill Building", 
      description: "Develop new skills through hands-on projects and real-time feedback.",
      image: "src/assets/skillbuilding.png",
      color: "#DDA0DD"
    },
    { 
      id: 7,
      title: "Industry Insights", 
      description: "Get insider knowledge about industry trends and best practices.",
      image: "src/assets/industryinsights.png",
      color: "#98D8C8"
    },
    { 
      id: 8,
      title: "Project Collaboration", 
      description: "Work on real projects with mentors and build your portfolio.",
      image: "src/assets/projectcollaboration.png",
      color: "#F7DC6F"
    }
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

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        {/* Section Title */}
        <div className={`about-header ${isVisible ? 'animate-in' : ''}`}>
          <h2 className="about-title">ABOUT</h2>
          <p className="about-subtitle">Discover what makes MentorLink special</p>
        </div>

        {/* Scrolling Cards */}
        <div className="cards-scroll-wrapper">
          <div className="cards-scroll-container">
            <div className="cards-track">
              {aboutItems.concat(aboutItems).map((item, idx) => (
                <div key={idx} className="about-card">
                  <div className="card-image-placeholder" style={{ backgroundColor: item.color }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="card-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="scroll-fade-left"></div>
        <div className="scroll-fade-right"></div>
      </div>
    </section>
  );
};

export default About;
