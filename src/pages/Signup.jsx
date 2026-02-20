import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { userAPI } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    gender: '',
    role: '',
    password: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({ label: '', color: '#e5e7eb', score: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const BIO_MAX_LENGTH = 200;

  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak', color: '#ef4444', score };
    if (score === 2) return { label: 'Fair', color: '#f59e0b', score };
    return { label: 'Strong', color: '#10b981', score };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await userAPI.signup(formData);
      localStorage.setItem('signupEmail', formData.email);
      localStorage.setItem('signupRole', formData.role);
      if (res?.verifyCode) {
        localStorage.setItem('verifyCode', res.verifyCode);
      }

      setShowSuccess(true);
      navigate('/otp');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signup-page">
      {/* Animated Background */}
      <div className="signup-bg-decoration">
        <div className="signup-circle signup-circle-1"></div>
        <div className="signup-circle signup-circle-2"></div>
        <div className="signup-circle signup-circle-3"></div>
      </div>

      <div className="signup-container">
        <h2 className="signup-title">Tell us About you..</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name*</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username */}
          <div className="form-group">
            <label>Username*</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 8,
                  background: '#e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(passwordStrength.score, 3) / 3 * 100}%`,
                    height: '100%',
                    background: passwordStrength.color,
                    transition: 'width 200ms ease',
                  }}
                />
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: passwordStrength.color }}>
                {formData.password ? `Strength: ${passwordStrength.label}` : 'Enter a password (8+ chars, uppercase, number, symbol)'}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label>Bio*</label>
            <textarea
              name="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={handleChange}
              maxLength={BIO_MAX_LENGTH}
              required
            />
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 6,
                  background: '#e5e7eb',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(formData.bio.length / BIO_MAX_LENGTH) * 100}%`,
                    height: '100%',
                    background: formData.bio.length >= BIO_MAX_LENGTH ? '#f59e0b' : '#667eea',
                    transition: 'width 200ms ease, background 200ms ease',
                  }}
                />
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#718096', display: 'flex', justifyContent: 'space-between' }}>
                <span>{formData.bio.length === 0 ? 'Tell us about yourself (max 200 characters)' : `${formData.bio.length} characters`}</span>
                <span style={{ fontWeight: 600, color: formData.bio.length >= BIO_MAX_LENGTH ? '#f59e0b' : '#667eea' }}>
                  {formData.bio.length}/{BIO_MAX_LENGTH}
                </span>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="form-group">
            <label>Gender*</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Role*</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="organizer">Event Organizer</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            <span>Create Account</span>
            <span className="btn-arrow">→</span>
          </button>
        </form>
      </div>

      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#10b981',
            color: 'white',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            zIndex: 9999,
          }}
        >
          Signup successful! Check your email for OTP…
        </div>
      )}
    </div>
  );
};

export default Signup;
