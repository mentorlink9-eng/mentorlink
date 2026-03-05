import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';
import contactImage from '../../assets/contact.png';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector('.contact-section');
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
    <section className="contact-section" id="contact">
<div className="contact-container" style={{ padding: '0' }}>
        {/* Left Illustration */}
        <div className="contact-illustration">
          <div className={`illustration-wrapper ${isVisible ? 'animate-in' : ''}`}>
            <img
              src={contactImage}
              alt="Contact Us Illustration"
              className="contact-image"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="contact-content">
          <div className={`content-wrapper ${isVisible ? 'animate-in' : ''}`}>
            <h2 className="contact-title">GET IN TOUCH</h2>
            <h3 className="contact-subtitle">Need Help? Let's Talk.</h3>
            <p className="contact-description">
              Whether you're a student, mentor, or organizer, we'd love to hear from you. 
              Reach out with questions, suggestions, or just to say hello!
            </p>
            {/* ✅ Navigate to ContactPage.jsx */}
            <button 
              className="contact-btn"
              onClick={() => navigate('/contact')}
            >
              CONTACT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
