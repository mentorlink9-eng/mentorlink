import React from 'react';
import Navbar from '../../../components/layout/navbar/Navbar';
import Footer from '../../../components/layout/footer/Footer';
import '../StaticPages.css';

const TermsAndConditions = () => {
  return (
    <div className="static-page">
      <Navbar />
      <div className="static-page-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using MentorLink, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            MentorLink is a platform that connects students, professionals, and mentors for
            guidance, career support, and knowledge sharing. We provide tools for scheduling
            sessions, messaging, and event management.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            You must register an account to use most features. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities
            under your account.
          </p>
          <ul>
            <li>You must provide accurate information during registration</li>
            <li>You must be at least 16 years old to use MentorLink</li>
            <li>One person may only maintain one account</li>
          </ul>
        </section>

        <section>
          <h2>4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform for any illegal or unauthorized purpose</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Post false, misleading, or deceptive content</li>
            <li>Attempt to gain unauthorized access to other accounts</li>
            <li>Use the platform for commercial solicitation without permission</li>
          </ul>
        </section>

        <section>
          <h2>5. Mentorship Sessions</h2>
          <p>
            MentorLink facilitates connections between mentors and mentees. We do not guarantee
            the quality of mentorship provided. Users are encouraged to communicate expectations
            clearly and provide feedback.
          </p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content, branding, and materials on MentorLink are the property of MentorLink
            and team KHUB. Users retain ownership of content they create and share on the platform.
          </p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            MentorLink is provided "as is" without warranties of any kind. We are not liable for
            any damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2>8. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after
            changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>
            For questions about these terms, please contact us through our{' '}
            <a href="/contact">Contact page</a>.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
