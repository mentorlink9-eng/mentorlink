import { useEffect, useState } from 'react';
import { Box, Container, Typography, Avatar, Card, CardContent, Rating } from '@mui/material';
import { FormatQuote as QuoteIcon } from '@mui/icons-material';
import './Testimonials.css';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Static testimonials data
  const testimonials = [
    {
      _id: '1',
      name: 'Rahul Sharma',
      role: 'Software Engineer',
      company: 'Google',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      feedback: 'MentorLink transformed my career! The mentors here are industry experts who genuinely care about your growth. I landed my dream job at Google thanks to the guidance I received.',
    },
    {
      _id: '2',
      name: 'Priya Patel',
      role: 'Product Manager',
      company: 'Microsoft',
      image: 'https://i.pravatar.cc/150?img=45',
      rating: 5,
      feedback: 'Absolutely amazing platform! The quality of mentors and the structured approach to learning is unmatched. Highly recommend to anyone looking to accelerate their career.',
    },
    {
      _id: '3',
      name: 'Arjun Mehta',
      role: 'Data Scientist',
      company: 'Amazon',
      image: 'https://i.pravatar.cc/150?img=33',
      rating: 5,
      feedback: 'Best investment in my career! The personalized mentorship helped me transition into data science smoothly. The networking opportunities are invaluable.',
    },
    {
      _id: '4',
      name: 'Sneha Reddy',
      role: 'UX Designer',
      company: 'Adobe',
      image: 'https://i.pravatar.cc/150?img=47',
      rating: 5,
      feedback: 'MentorLink is a game-changer! The mentors are supportive, knowledgeable, and genuinely invested in your success. The platform is easy to use and very effective.',
    },
    {
      _id: '5',
      name: 'Vikram Singh',
      role: 'Full Stack Developer',
      company: 'Flipkart',
      image: 'https://i.pravatar.cc/150?img=15',
      rating: 5,
      feedback: 'Outstanding mentorship experience! I improved my technical skills significantly and learned so much about career planning. The events are also top-notch.',
    },
    {
      _id: '6',
      name: 'Anjali Gupta',
      role: 'DevOps Engineer',
      company: 'Netflix',
      image: 'https://i.pravatar.cc/150?img=48',
      rating: 5,
      feedback: 'The mentorship quality here is exceptional. My mentor helped me navigate complex career decisions and I grew both professionally and personally.',
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

    const section = document.querySelector('.testimonials-section');
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
    <section className="testimonials-section">
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box className={`testimonials-header ${isVisible ? 'animate-in' : ''}`}>
          <Typography variant="h3" className="testimonials-title">
            What Our Users Say
          </Typography>
          <Typography variant="h6" className="testimonials-subtitle">
            Hear from thousands of satisfied learners and professionals who transformed their careers
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Box className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial._id}
              className="testimonial-card-unstop"
              sx={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="testimonial-card-content">
                {/* Quote Icon */}
                <Box className="quote-icon-wrapper">
                  <QuoteIcon className="quote-icon" />
                </Box>

                {/* Rating */}
                <Box className="testimonial-rating">
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    size="small"
                    sx={{ color: '#ffd700' }}
                  />
                </Box>

                {/* Feedback Text */}
                <Typography variant="body1" className="testimonial-feedback-text">
                  "{testimonial.feedback}"
                </Typography>

                {/* Author Info */}
                <Box className="testimonial-author-section">
                  <Avatar
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="testimonial-author-avatar"
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box className="testimonial-author-details">
                    <Typography variant="h6" className="testimonial-author-name">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" className="testimonial-author-role">
                      {testimonial.role} • {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Infinite Scroll Animation - Unstop Style */}
        <Box className="testimonials-scroll-wrapper">
          <Box className="testimonials-scroll-track">
            {/* First set */}
            {testimonials.slice(0, 4).map((testimonial) => (
              <Box key={`scroll-1-${testimonial._id}`} className="testimonial-scroll-card">
                <Avatar src={testimonial.image} sx={{ width: 40, height: 40 }} />
                <Box className="scroll-card-content">
                  <Typography variant="body2" className="scroll-card-name">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption" className="scroll-card-text">
                    "{testimonial.feedback.substring(0, 80)}..."
                  </Typography>
                </Box>
              </Box>
            ))}
            {/* Duplicate for seamless loop */}
            {testimonials.slice(0, 4).map((testimonial) => (
              <Box key={`scroll-2-${testimonial._id}`} className="testimonial-scroll-card">
                <Avatar src={testimonial.image} sx={{ width: 40, height: 40 }} />
                <Box className="scroll-card-content">
                  <Typography variant="body2" className="scroll-card-name">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption" className="scroll-card-text">
                    "{testimonial.feedback.substring(0, 80)}..."
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default Testimonials;
