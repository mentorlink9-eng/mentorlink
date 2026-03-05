import React from 'react';
import Hero from '../../../components/landing/Hero';
import About from '../../../components/landing/About';
import WhyMentorLink from '../../../components/landing/WhyMentorLink';
import Testimonials from '../../../components/landing/Testimonials';
import Feedback from '../../../components/landing/Feedback';
import Contact from '../../../components/landing/Contact';
import CTASection from '../../../components/landing/CTASection';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <Hero />
      <About />
      <WhyMentorLink/>
      <Testimonials/>
      <Feedback/>
      <Contact/>
      <CTASection/>
    </div>
  );
};

export default Landing;
