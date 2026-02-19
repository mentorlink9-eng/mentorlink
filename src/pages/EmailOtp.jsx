import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailOtp.css';
import logoImage from '../assets/mentorlink-logo.png';
import { userAPI } from '../services/api';
import { FiMail, FiRefreshCw, FiCheck, FiAlertCircle } from 'react-icons/fi';

const EmailOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleContinue = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter the complete 6-digit OTP' });
      return;
    }

    const email = localStorage.getItem('signupEmail');
    const role = localStorage.getItem('signupRole');

    if (!email || !role) {
      setMessage({ type: 'error', text: 'Session expired. Please sign up again.' });
      setTimeout(() => navigate('/signup'), 2000);
      return;
    }

    try {
      setMessage({ type: 'loading', text: 'Verifying OTP...' });
      const res = await userAPI.verifyOTP({ email, otp: code });
      if (res?.token) {
        localStorage.setItem('token', res.token);
      }

      // Get userId from verify response (user is created in DB after OTP verification)
      const userId = res?.user?.id;
      if (userId) {
        localStorage.setItem('userId', userId);
      }

      setMessage({ type: 'success', text: 'Verification successful!' });

      // Success: route to role-specific form
      setTimeout(() => {
        if (role === 'student') {
          navigate('/student-form', { state: { userId } });
        } else if (role === 'mentor') {
          navigate('/mentor-form', { state: { userId } });
        } else if (role === 'organizer') {
          navigate('/event-organizer', { state: { userId } });
        } else {
          navigate('/home');
        }
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Invalid or expired OTP' });
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    setMessage({ type: 'loading', text: 'Resending OTP...' });

    try {
      const email = localStorage.getItem('signupEmail');
      if (!email) {
        setMessage({ type: 'error', text: 'Session expired. Please sign up again.' });
        setTimeout(() => navigate('/signup'), 2000);
        return;
      }
      await userAPI.resendOTP({ email });
      setTimer(30);
      setOtp(new Array(6).fill(''));
      setMessage({ type: 'success', text: 'OTP resent successfully! Check your email.' });
      inputRefs.current[0]?.focus();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to resend OTP. Please try again.' });
    } finally {
      setIsResending(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="otp-page">
      {/* Animated Background */}
      <div className="otp-bg-decoration">
        <div className="otp-circle otp-circle-1"></div>
        <div className="otp-circle otp-circle-2"></div>
        <div className="otp-circle otp-circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="otp-container">
        {/* Logo */}
        <div className="otp-logo-container">
          <img src={logoImage} alt="MentorLink Logo" className="otp-logo" />
        </div>

        {/* Header */}
        <div className="otp-header">
          <h1 className="otp-title">Verify Your Email</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to
          </p>
          <p className="otp-email">{localStorage.getItem('signupEmail')}</p>
        </div>

        {/* OTP Input Section */}
        <div className="otp-form">
          <label className="otp-label">Enter Verification Code</label>

          <div className="otp-input-group">
            {otp.map((data, index) => (
              <input
                key={index}
                className={`otp-input ${data ? 'otp-input-filled' : ''}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onFocus={e => e.target.select()}
                onPaste={index === 0 ? handlePaste : undefined}
                ref={el => (inputRefs.current[index] = el)}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`otp-message otp-message-${message.type}`}>
              {message.type === 'error' && <FiAlertCircle />}
              {message.type === 'success' && <FiCheck />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Resend Section */}
          <div className="otp-resend-section">
            <p className="otp-resend-text">
              Didn't receive the code?{' '}
              <button
                className={`otp-resend-button ${timer > 0 ? 'otp-resend-disabled' : ''}`}
                onClick={handleResend}
                disabled={timer > 0 || isResending}
              >
                {isResending ? (
                  <>
                    <FiRefreshCw className="otp-spin" /> Resending...
                  </>
                ) : (
                  <>
                    <FiRefreshCw /> Resend OTP
                  </>
                )}
              </button>
            </p>
            {timer > 0 && (
              <div className="otp-timer-container">
                <div className="otp-timer-bar" style={{ width: `${(timer / 30) * 100}%` }}></div>
              </div>
            )}
            {timer > 0 && (
              <p className="otp-timer-text">
                Resend available in <span className="otp-timer-highlight">{formatTime(timer)}</span>
              </p>
            )}
          </div>

          {/* Continue Button */}
          <button
            className={`otp-continue-btn ${isOtpComplete ? 'otp-continue-active' : ''}`}
            onClick={handleContinue}
            disabled={!isOtpComplete}
          >
            {message.type === 'loading' ? (
              <>
                <div className="otp-spinner"></div>
                Verifying...
              </>
            ) : (
              <>
                Verify & Continue
                <span className="otp-arrow">→</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="otp-footer">
          <p>Need help? <a href="/contact" className="otp-footer-link">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default EmailOtp;
