import React from 'react';
import Navbar from '../../../components/layout/navbar/Navbar';
import Footer from '../../../components/layout/footer/Footer';
import '../StaticPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="static-page">
      <Navbar />
      <div className="static-page-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, role, and profile details you provide during registration</li>
            <li><strong>Profile Data:</strong> Skills, domains of interest, experience level, LinkedIn URL, and other information you add to your profile</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, session duration, and interactions on the platform</li>
            <li><strong>Communication Data:</strong> Messages sent through the platform, session notes, and feedback</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain the MentorLink service</li>
            <li>To match mentors with mentees based on skills and interests</li>
            <li>To send notifications about sessions, messages, and platform updates</li>
            <li>To improve our platform and user experience</li>
            <li>To ensure platform security and prevent abuse</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Sharing</h2>
          <p>
            We do not sell your personal information. Your profile information is visible to
            other registered users on the platform. We may share anonymized, aggregated data
            for analytical purposes.
          </p>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures including encrypted passwords,
            JWT authentication, and secure HTTPS connections to protect your data.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            We use localStorage and sessionStorage to maintain your login session and
            preferences (such as dark mode). We do not use third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data through your profile settings</li>
            <li>Update or correct your information at any time</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. If you delete your
            account, we will remove your personal data within 30 days, except where required
            by law to retain it.
          </p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy periodically. We will notify users of significant
            changes through the platform.
          </p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please reach out through our{' '}
            <a href="/contact">Contact page</a>.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
