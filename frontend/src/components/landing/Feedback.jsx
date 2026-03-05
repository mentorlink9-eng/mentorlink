import React, { useEffect, useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    { 
      id: 1,
      text: "Good for mentorship, helped me acquired skills required by google", 
      author: "Balu", 
      role: "SDE, Google",
      avatar: "👨‍💻"
    },
    { 
      id: 2,
      text: "Easy to find the tech events. Help me Showcase my idea among professionals", 
      author: "Sravan", 
      role: "Startup founder",
      avatar: "🚀"
    },
    { 
      id: 3,
      text: "Been a Student leaning skills presenting them at higher levels love to learn here", 
      author: "Durga Prasad Korukonda", 
      role: "Team lead Khub",
      avatar: "👨‍🎓"
    },
    { 
      id: 4,
      text: "Amazing platform for connecting with industry experts and growing my network", 
      author: "Priya Sharma", 
      role: "Software Developer",
      avatar: "👩‍💻"
    },
    { 
      id: 5,
      text: "Perfect for both mentors and mentees to grow together in a collaborative environment", 
      author: "Rahul Kumar", 
      role: "Product Manager",
      avatar: "👨‍💼"
    },
    { 
      id: 6,
      text: "Revolutionary way to find and attend tech events. Saved me so much time!", 
      author: "Anjali Patel", 
      role: "Data Scientist",
      avatar: "👩‍🔬"
    },
    { 
      id: 7,
      text: "The mentorship quality here is exceptional. My career took a huge leap!", 
      author: "Vikram Singh", 
      role: "Full Stack Developer",
      avatar: "👨‍🚀"
    },
    { 
      id: 8,
      text: "Love the community aspect. Found my co-founder through MentorLink events!", 
      author: "Sneha Reddy", 
      role: "Entrepreneur",
      avatar: "👩‍💼"
    },
    { 
      id: 9,
      text: "Best platform for skill development. The progress tracking is incredibly helpful", 
      author: "Arjun Mehta", 
      role: "UI/UX Designer",
      avatar: "🎨"
    },
    { 
      id: 10,
      text: "Transformed my learning journey. The mentors here are world-class professionals", 
      author: "Kavya Nair", 
      role: "AI Engineer",
      avatar: "🤖"
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

    const section = document.querySelector('.feedback-section');
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
    <section className="feedback-section">
      <div className="feedback-container">
        {/* Section Header */}
        <div className={`feedback-header ${isVisible ? 'animate-in' : ''}`}>
          <h2 className="feedback-title">Our User Feedback</h2>
        </div>

        {/* Scrolling Testimonials Container */}
        <div className="testimonials-scroll-wrapper">
          <div className="testimonials-scroll-container">
            <div className="testimonials-track">
              {/* First set of testimonials */}
              {testimonials.map((testimonial) => (
                <div key={`first-${testimonial.id}`} className="testimonial-card">
                  {/* Author info first */}
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <span className="avatar-emoji">{testimonial.avatar}</span>
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.author}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Feedback text below */}
                  <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {testimonials.map((testimonial) => (
                <div key={`second-${testimonial.id}`} className="testimonial-card">
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <span className="avatar-emoji">{testimonial.avatar}</span>
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.author}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fade effects */}
        <div className="scroll-fade-left"></div>
        <div className="scroll-fade-right"></div>
      </div>
    </section>
  );
};

export default Feedback;
