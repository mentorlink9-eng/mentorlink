import React, { useState } from 'react';
import Navbar from '../../../components/layout/navbar/Navbar';
import Footer from '../../../components/layout/footer/Footer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import '../StaticPages.css';

const faqs = [
  {
    q: 'What is MentorLink?',
    a: 'MentorLink is a platform that connects students and professionals with experienced mentors for career guidance, skill development, project help, and more.'
  },
  {
    q: 'Is MentorLink free to use?',
    a: 'Yes! Creating an account, browsing mentors, and sending connection requests are completely free. Some events hosted on the platform may have their own fees set by organizers.'
  },
  {
    q: 'How do I find a mentor?',
    a: 'Navigate to the Mentors page, browse profiles, and use filters to find mentors in your domain of interest. You can then send a connection request with a personalized message.'
  },
  {
    q: 'How do I become a mentor?',
    a: 'Sign up and select "Mentor" as your role. Fill out the mentor form with your expertise, experience, and availability. Once submitted, your profile will be visible to students.'
  },
  {
    q: 'How do mentorship sessions work?',
    a: 'Once a mentor accepts your connection request, you can schedule sessions through the platform. Sessions can be conducted via text chat, calls, or asynchronous messaging based on mutual preference.'
  },
  {
    q: 'Can I be both a mentor and a student?',
    a: 'Currently, each account is tied to one role (student, mentor, or event organizer). You would need separate accounts for different roles.'
  },
  {
    q: 'How do I host an event?',
    a: 'Sign up as an Event Organizer, then navigate to "Host an Event" from the Events page. Fill in your event details, upload a banner, and publish it for the community.'
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use encrypted passwords, JWT-based authentication, and secure connections to protect your data. Read our Privacy Policy for more details.'
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings and contact our admin team for account deletion. Your data will be removed within 30 days of the request.'
  },
  {
    q: 'Who built MentorLink?',
    a: 'MentorLink was built by team KHUB as a project to bridge the gap between learners and leaders in the tech community.'
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="static-page">
      <Navbar />
      <div className="static-page-content">
        <h1>Frequently Asked Questions</h1>
        <p className="last-updated">Have a question? Find answers below.</p>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggle(i)}>
                <span>{faq.q}</span>
                {openIndex === i ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openIndex === i && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;
