// src/pages/HostEventForm.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from '../config/api';
import HomeNavbar from "../components/common/HomeNavbar";
import "./HostEventForm.css";

const HostEventForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const organizerId = location.state?.organizerId || null;

  const [formData, setFormData] = useState({
    eventName: "",
    tagline: "",
    eventType: "",
    eventMode: "",
    isPaid: false,
    amount: "",
    startDate: "",
    endDate: "",
    timings: "",
    banner: null,
    registrationLink: "",
    details: "",
    importantToRemember: "",
    additionalInfo: "",
    contactAddress: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (name === "banner") {
      setFormData({ ...formData, banner: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!organizerId) {
        alert("Organizer ID is missing. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        alert("End date must be after start date");
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "banner" && value) {
          data.append(key, value);
        } else {
          data.append(key, value);
        }
      });

      data.append("organizerId", organizerId);

      const response = await axios.post(
        `${API_BASE}/events`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Event created successfully!");
      console.log("Event created:", response.data);
      navigate("/events");
    } catch (err) {
      console.error("Error submitting event:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Error submitting event";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HomeNavbar />
      <div className="event-form-container">
        <form className="event-form" onSubmit={handleSubmit}>
          <h2>Host an Event</h2>

          {/* Event Name */}
          <div className="form-group">
            <label htmlFor="eventName">Event Name *</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              placeholder="Enter event name"
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event Tagline */}
          <div className="form-group">
            <label htmlFor="tagline">Event Tagline</label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              placeholder="A catchy tagline for your event"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>

          {/* Event Type */}
          <div className="form-group">
            <label htmlFor="eventType">Event Type *</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Select Event Type</option>
              <option value="Workshop">Workshop</option>
              <option value="Seminar">Seminar</option>
              <option value="Webinar">Webinar</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Competition">Competition</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Event Mode */}
          <div className="form-group">
            <label>Event Mode *</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="eventMode"
                  value="Online"
                  checked={formData.eventMode === "Online"}
                  onChange={handleChange}
                  required
                />
                Online
              </label>
              <label>
                <input
                  type="radio"
                  name="eventMode"
                  value="Offline"
                  checked={formData.eventMode === "Offline"}
                  onChange={handleChange}
                  required
                />
                Offline
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="form-group">
            <label>Pricing *</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="isPaid"
                  value="false"
                  checked={!formData.isPaid}
                  onChange={() =>
                    setFormData({ ...formData, isPaid: false, amount: "" })
                  }
                  required
                />
                Free
              </label>
              <label>
                <input
                  type="radio"
                  name="isPaid"
                  value="true"
                  checked={formData.isPaid}
                  onChange={() =>
                    setFormData({ ...formData, isPaid: true })
                  }
                  required
                />
                Paid
              </label>
            </div>
          </div>

          {/* Amount (conditional) */}
          {formData.isPaid && (
            <div className="form-group">
              <label htmlFor="amount">Amount (in ₹) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          )}

          {/* Start Date */}
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Date */}
          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              required
            />
          </div>

          {/* Event Timings */}
          <div className="form-group">
            <label htmlFor="timings">Event Timings *</label>
            <input
              type="text"
              id="timings"
              name="timings"
              placeholder="e.g., 9:00 AM - 5:00 PM IST"
              value={formData.timings}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event Banner */}
          <div className="form-group">
            <label htmlFor="banner">Event Banner *</label>
            <input
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={handleChange}
              required
            />
            {formData.banner && (
              <p className="file-name">Selected: {formData.banner.name}</p>
            )}
          </div>

          {/* Registration Link */}
          <div className="form-group">
            <label htmlFor="registrationLink">Registration Link *</label>
            <input
              type="url"
              id="registrationLink"
              name="registrationLink"
              placeholder="https://example.com/register"
              value={formData.registrationLink}
              onChange={handleChange}
              required
            />
          </div>

          {/* Event Details */}
          <div className="form-group">
            <label htmlFor="details">Event Details *</label>
            <textarea
              id="details"
              name="details"
              placeholder="Provide a brief description or about section for the event"
              value={formData.details}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          {/* Important Things to Remember */}
          <div className="form-group">
            <label htmlFor="importantToRemember">
              Important Things to Remember
            </label>
            <textarea
              id="importantToRemember"
              name="importantToRemember"
              placeholder="Any important notes or things participants should remember"
              value={formData.importantToRemember}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Additional Information */}
          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Any additional information about the event"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {/* Contact & Venue Address */}
          <div className="form-group">
            <label htmlFor="contactAddress">Contact & Venue Address *</label>
            <textarea
              id="contactAddress"
              name="contactAddress"
              placeholder="Provide contact details and venue address (if offline)"
              value={formData.contactAddress}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Event"}
          </button>
        </form>
      </div>
    </>
  );
};

export default HostEventForm;
