import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./MentorForm.css";
import { useNavigate, useLocation } from "react-router-dom";
import { mentorAPI } from "../../../services/api";
import { FiCheckCircle } from 'react-icons/fi';

const MentorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const [formData, setFormData] = useState({
    user: userId || '',
    primaryDomain: "",
    secondaryDomain: "",
    linkedin: "",
    phone: "",
    role: "",
    requirements: false,
    primaryExperience: "",
    mentorshipExperience: "",
    mentoringStyle: [],
    weeklyAvailability: [],
    skills: []
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({ ...prev, user: userId }));
    }
  }, [userId]);

  const domains = [
    "Web Development", "Mobile Development", "Data Science", "Machine Learning",
    "UI/UX Design", "Product Management", "Cloud Computing", "Cybersecurity",
    "DevOps", "AI/ML Ops", "Blockchain", "Digital Marketing", "Finance",
    "Business Strategy", "Career Coaching", "Interview Preparation"
  ];

  const mentoringStyles = ["Text", "Call", "Asynchronous"];
  const weeklyAvailabilityOptions = ["1-2 hrs", "3-5 hrs", "On-demand"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCheckboxGroup = (name, value) => {
    setFormData((prev) => {
      const current = [...prev[name]];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleSkillsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions ? selectedOptions.map((opt) => opt.value) : []
    }));
  };

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "C#", label: "C#" },
    { value: "Ruby", label: "Ruby" },
    { value: "PHP", label: "PHP" },
    { value: "Swift", label: "Swift" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "Go", label: "Go" },
    { value: "Rust", label: "Rust" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "SQL", label: "SQL" },
    { value: "HTML/CSS", label: "HTML/CSS" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" }
  ];

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, phone: val }));
    if (val && val.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone && formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    console.log("Mentor form submitted:", formData);
    try {
      const response = await mentorAPI.submitForm(formData);
      console.log("Mentor form submission response:", response);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Mentor form submission error:", error);
      alert('Mentor form submission failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="mentor-form-page">
      {/* Animated Background */}
      <div className="mentor-bg-decoration">
        <div className="mentor-circle mentor-circle-1"></div>
        <div className="mentor-circle mentor-circle-2"></div>
        <div className="mentor-circle mentor-circle-3"></div>
      </div>

      <div className="mentor-form-container">
        <h2 className="mentor-title">Complete Your Mentor Profile</h2>

        <form className="mentor-form" onSubmit={handleSubmit}>
          {/* Primary Domain */}
          <div className="form-group">
            <label>Primary Domain*</label>
            <select
              name="primaryDomain"
              value={formData.primaryDomain}
              onChange={handleChange}
              required
            >
              <option value="">Select Primary Domain</option>
              {domains.map((domain, i) => (
                <option key={i} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Domain */}
          <div className="form-group">
            <label>Secondary Domain</label>
            <select
              name="secondaryDomain"
              value={formData.secondaryDomain}
              onChange={handleChange}
            >
              <option value="">Select Secondary Domain</option>
              {domains.map((domain, i) => (
                <option key={i} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          {/* LinkedIn */}
          <div className="form-group">
            <label>LinkedIn Profile*</label>
            <input
              type="text"
              name="linkedin"
              placeholder="Enter your LinkedIn profile URL"
              value={formData.linkedin}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={handlePhoneChange}
              maxLength={10}
            />
            {phoneError && (
              <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>
                {phoneError}
              </span>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label>Current Role & Organization*</label>
            <input
              type="text"
              name="role"
              placeholder="e.g., Senior Engineer @ ABC Corp"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          {/* Experience */}
          <div className="form-group">
            <label>Experience in Primary Domain*</label>
            <input
              type="text"
              name="primaryExperience"
              placeholder="Years of experience"
              value={formData.primaryExperience}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mentorship Experience */}
          <div className="form-group">
            <label>Mentorship Experience*</label>
            <textarea
              name="mentorshipExperience"
              placeholder="Mention your mentorship experience..."
              value={formData.mentorshipExperience}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          {/* Mentoring Style */}
          <div className="form-group">
            <label>Preferred Mentoring Style*</label>
            <div className="checkbox-group">
              {mentoringStyles.map((style) => (
                <label key={style}>
                  <input
                    type="checkbox"
                    value={style}
                    checked={formData.mentoringStyle.includes(style)}
                    onChange={() => handleCheckboxGroup("mentoringStyle", style)}
                  />
                  {style}
                </label>
              ))}
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="form-group">
            <label>Weekly Availability*</label>
            <div className="checkbox-group">
              {weeklyAvailabilityOptions.map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    value={opt}
                    checked={formData.weeklyAvailability.includes(opt)}
                    onChange={() => handleCheckboxGroup("weeklyAvailability", opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="form-group">
            <label>Skills You Can Mentor In</label>
            <Select
              options={skillOptions}
              isMulti
              onChange={handleSkillsChange}
              placeholder="Search and select skills..."
              className="skills-select"
              classNamePrefix="select"
            />
          </div>

          {/* Requirements Checkbox */}
          <div className="form-group">
            <label>Requirements</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="requirements"
                  checked={formData.requirements}
                  onChange={handleChange}
                />
                I meet the requirements to be a mentor
              </label>
            </div>
          </div>

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

export default MentorForm;
