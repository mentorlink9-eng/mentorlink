import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailOtp.css';
import logoImage from '../assets/mentorlink-logo.png';
import { userAPI } from '../services/api';
import { FiRefreshCw, FiCheck, FiAlertCircle, FiShield } from 'react-icons/fi';

const EmailOtp = () => {
  const [verifyCode, setVerifyCode] = useState(''); // code shown on screen
  const [inputValue, setInputValue] = useState(''); // what user types
  const [timer, setTimer] = useState(300);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // On mount, get the verifyCode stored by Signup page
  useEffect(() => {
    const code = localStorage.getItem('verifyCode');
    if (code) {
      setVerifyCode(code);
    }
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = async () => {
    const code = inputValue.trim().toUpperCase();
    if (!code) {
      setMessage({ type: 'error', text: 'Please enter the verification code shown above.' });
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
      setMessage({ type: 'loading', text: 'Verifying...' });
      const res = await userAPI.verifyOTP({ email, otp: code });

      if (res?.token) localStorage.setItem('token', res.token);
      const userId = res?.user?.id;
      if (userId) localStorage.setItem('userId', userId);

      localStorage.removeItem('verifyCode');
      setMessage({ type: 'success', text: 'Verification successful!' });

      setTimeout(() => {
        if (role === 'student') navigate('/student-form', { state: { userId } });
        else if (role === 'mentor') navigate('/mentor-form', { state: { userId } });
        else if (role === 'organizer') navigate('/event-organizer', { state: { userId } });
        else navigate('/home');
      }, 1000);
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Invalid or expired code. Try refreshing.' });
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleRefresh = async () => {
    if (timer > 0 || isRefreshing) return;

    setIsRefreshing(true);
    setMessage({ type: 'loading', text: 'Getting new code...' });

    try {
      const email = localStorage.getItem('signupEmail');
      if (!email) {
        setMessage({ type: 'error', text: 'Session expired. Please sign up again.' });
        setTimeout(() => navigate('/signup'), 2000);
        return;
      }
      const res = await userAPI.resendOTP({ email });
      const newCode = res?.verifyCode;
      if (newCode) {
        setVerifyCode(newCode);
        localStorage.setItem('verifyCode', newCode);
      }
      setTimer(300);
      setInputValue('');
      setMessage({ type: 'success', text: 'New code generated!' });
      inputRef.current?.focus();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || 'Failed to get new code. Please try again.' });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) handleContinue();
  };

  return (
    <div className="otp-page">
      {/* Animated Background */}
      <div className="otp-bg-decoration">
        <div className="otp-circle otp-circle-1"></div>
        <div className="otp-circle otp-circle-2"></div>
        <div className="otp-circle otp-circle-3"></div>
      </div>

      <div className="otp-container">
        {/* Logo */}
        <div className="otp-logo-container">
          <img src={logoImage} alt="MentorLink Logo" className="otp-logo" />
        </div>

        {/* Header */}
        <div className="otp-header">
          <div className="otp-shield-icon"><FiShield /></div>
          <h1 className="otp-title">Verify Your Account</h1>
          <p className="otp-subtitle">
            Type the code shown below exactly as displayed
          </p>
        </div>

        {/* Captcha Code Display */}
        <div className="captcha-box">
          <div className="captcha-label">Your Verification Code</div>
          <div className="captcha-code">
            {verifyCode ? verifyCode.split('').map((char, i) => (
              <span key={i} className="captcha-char">{char}</span>
            )) : (
              <span className="captcha-loading">Loading...</span>
            )}
          </div>
          <div className="captcha-hint">Type this code in the box below — expires in {formatTime(timer)}</div>
        </div>

        {/* Input + Actions */}
        <div className="otp-form">
          <label className="otp-label">Enter the code above</label>
          <input
            ref={inputRef}
            className="captcha-input"
            type="text"
            placeholder="e.g. A3KP7X"
            value={inputValue}
            onChange={e => setInputValue(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Message */}
          {message.text && (
            <div className={`otp-message otp-message-${message.type}`}>
              {message.type === 'error' && <FiAlertCircle />}
              {message.type === 'success' && <FiCheck />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Refresh Section */}
          <div className="otp-resend-section">
            <p className="otp-resend-text">
              Code expired?{' '}
              <button
                className={`otp-resend-button ${timer > 0 ? 'otp-resend-disabled' : ''}`}
                onClick={handleRefresh}
                disabled={timer > 0 || isRefreshing}
              >
                {isRefreshing ? (
                  <><FiRefreshCw className="otp-spin" /> Getting new code...</>
                ) : (
                  <><FiRefreshCw /> Get New Code</>
                )}
              </button>
            </p>
            {timer > 0 && (
              <div className="otp-timer-container">
                <div className="otp-timer-bar" style={{ width: `${(timer / 300) * 100}%` }}></div>
              </div>
            )}
            {timer > 0 && (
              <p className="otp-timer-text">
                New code available in <span className="otp-timer-highlight">{formatTime(timer)}</span>
              </p>
            )}
          </div>

          {/* Continue Button */}
          <button
            className={`otp-continue-btn ${inputValue.trim().length === 6 ? 'otp-continue-active' : ''}`}
            onClick={handleContinue}
            disabled={inputValue.trim().length === 0}
          >
            {message.type === 'loading' ? (
              <><div className="otp-spinner"></div>Verifying...</>
            ) : (
              <>Verify & Continue <span className="otp-arrow">→</span></>
            )}
          </button>
        </div>

        <div className="otp-footer">
          <p>Need help? <a href="/contact" className="otp-footer-link">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default EmailOtp;
