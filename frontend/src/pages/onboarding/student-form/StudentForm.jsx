import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentForm.css";
import { studentAPI } from "../../../services/api";
import logoImage from '../../../assets/mentorlink-logo.png';
import {
  FiUser,
  FiTarget,
  FiBook,
  FiTrendingUp,
  FiHeart,
  FiCalendar,
  FiMessageCircle,
  FiLinkedin,
  FiCheckCircle,
  FiX
} from 'react-icons/fi';

const StudentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const [formData, setFormData] = useState({
    user: userId || '',
    roleStatus: "",
    mentorshipField: [],
    experienceLevel: "",
    mentorshipTypes: [],
    frequency: "",
    style: "",
    goal: "",
    portfolio: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const id = userId || localStorage.getItem('userId');
    if (!id) {
      alert('Session expired. Please sign up again.');
      navigate('/signup');
      return;
    }
    setFormData((prev) => ({ ...prev, user: id }));
  }, [userId, navigate]);

  const domains = [
    "Web Development",
    "AI & ML",
    "Cybersecurity",
    "Data Science",
    "Cloud Computing",
    "Blockchain",
    "UI/UX Design",
    "Networking",
    "Competitive Programming",
  ];

  const handleDomainSelect = (e) => {
    const value = e.target.value;
    if (value && !formData.mentorshipField.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        mentorshipField: [...prev.mentorshipField, value],
      }));
    }
    setInputValue("");
  };

  const removeDomain = (domain) => {
    setFormData((prev) => ({
      ...prev,
      mentorshipField: prev.mentorshipField.filter((d) => d !== domain),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted form data:", formData);
    try {
      const response = await studentAPI.submitForm(formData);
      console.log("Student form submission response:", response);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Student form submission error:", error);
      alert('Student form submission failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="student-form-page">
      {/* Animated Background */}
      <div className="student-bg-decoration">
        <div className="student-circle student-circle-1"></div>
        <div className="student-circle student-circle-2"></div>
        <div className="student-circle student-circle-3"></div>
      </div>

      {/* Main Content */}
      <div className="student-form-container">
        {/* Header */}
        <h2 className="student-title">Tell us about your goals..</h2>

        {/* Form */}
        <form className="student-form" onSubmit={handleSubmit}>
          {/* Q1: Role Status */}
          <div className="form-group">
            <label>Current Role/Status*</label>
            <select
              name="roleStatus"
              value={formData.roleStatus}
              onChange={handleChange}
              required
            >
              <option value="">Select your current status</option>
              <option value="student">Student</option>
              <option value="working">Working Professional</option>
              <option value="careerSwitch">Career Switcher</option>
            </select>
          </div>

          {/* Q2: Mentorship Fields */}
          <div className="form-group">
            <label>Field/Domain of Interest*</label>

            {/* Selected Domains Tags */}
            {formData.mentorshipField.length > 0 && (
              <div className="selected-domains">
                {formData.mentorshipField.map((domain, index) => (
                  <span key={index} className="tag">
                    {domain}
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeDomain(domain)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Domain Selector */}
            <select
              value={inputValue}
              onChange={handleDomainSelect}
              required={formData.mentorshipField.length === 0}
            >
              <option value="">Choose a domain to add</option>
              {domains.map((domain, index) => (
                <option
                  key={index}
                  value={domain}
                  disabled={formData.mentorshipField.includes(domain)}
                >
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Q3: Experience Level */}
          <div className="form-group">
            <label>Experience Level*</label>
            <div className="checkbox-group">
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <label key={level}>
                  <input
                    type="radio"
                    name="experienceLevel"
                    value={level}
                    checked={formData.experienceLevel === level}
                    onChange={handleChange}
                    required
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

          {/* Q4: Mentorship Types */}
          <div className="form-group">
            <label>Type of Mentorship*</label>
            <div className="checkbox-group">
              {[
                "Career guidance",
                "Project help / portfolio review",
                "Resume & LinkedIn feedback",
                "Mock interviews",
                "Learning roadmap",
                "Doubt-solving / weekly check-ins",
              ].map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    name="mentorshipTypes"
                    value={item}
                    checked={formData.mentorshipTypes.includes(item)}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Q5: Frequency */}
          <div className="form-group">
            <label>Mentorship Frequency*</label>
            <div className="checkbox-group">
              {["Once a week", "Twice a month", "On-demand (as needed)"].map((freq) => (
                <label key={freq}>
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={formData.frequency === freq}
                    onChange={handleChange}
                    required
                  />
                  {freq}
                </label>
              ))}
            </div>
          </div>

          {/* Q6: Mentorship Style */}
          <div className="form-group">
            <label>Preferred Style*</label>
            <div className="checkbox-group">
              {["Text", "Call", "Asynchronous"].map((style) => (
                <label key={style}>
                  <input
                    type="radio"
                    name="style"
                    value={style}
                    checked={formData.style === style}
                    onChange={handleChange}
                    required
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>

          {/* Q7: Short-term Goal */}
          <div className="form-group">
            <label>Short-term Goal*</label>
            <input
              type="text"
              name="goal"
              placeholder="e.g., I want to build a portfolio to apply for internships"
              value={formData.goal}
              onChange={handleChange}
              required
            />
          </div>

          {/* Q8: Portfolio/LinkedIn */}
          <div className="form-group">
            <label>LinkedIn/Portfolio</label>
            <input
              type="text"
              name="portfolio"
              placeholder="Help mentors understand you better"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Continue
          </button>
        </form>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="success-toast">
          <FiCheckCircle className="toast-icon" />
          <span>Profile created successfully! Redirecting...</span>
        </div>
      )}
    </div>
  );
};

export default StudentForm;
