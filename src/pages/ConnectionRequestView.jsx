import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HomeNavbar from '../components/common/HomeNavbar';
import { requestAPI } from '../services/api';
import PageSkeleton from '../components/common/PageSkeleton';
import './ConnectionRequestView.css';

const ConnectionRequestView = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const response = await requestAPI.getRequestById(requestId);
        setRequest(response.request);
      } catch (error) {
        console.error('Error fetching request:', error);
        alert('Failed to load request details');
        navigate('/mentor-profile');
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequest();
    }
  }, [requestId, navigate]);

  if (loading) {
    return (
      <div className="connection-request-view-page">
        <HomeNavbar />
        <div style={{ padding: '24px' }}>
          <PageSkeleton variant="request" />
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="connection-request-view-page">
        <HomeNavbar />
        <div className="error-container">
          <p>Request not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connection-request-view-page">
      <HomeNavbar />

      <div className="request-view-container">
        <div className="request-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            back
          </button>
          <h1 className="request-title">Review Request</h1>
          <div className="theme-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>

        <div className="request-content">
          {/* Left Column - Form Information */}
          <div className="request-form-section">
            <div className="form-section">
              <h2 className="section-title">Career & Goals</h2>

              <div className="info-group">
                <label>Contact Information</label>
                <div className="info-content">
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{request.contactInfo?.email || 'N/A'}</span>
                  </div>
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{request.contactInfo?.phone || 'N/A'}</span>
                  </div>
                  {request.contactInfo?.linkedIn && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <a href={request.contactInfo.linkedIn} target="_blank" rel="noopener noreferrer">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-group">
                <label>Professional Background</label>
                <div className="info-content">
                  <p><strong>Current Role:</strong> {request.bio?.split(' - ')[1]?.split(' with ')[0] || 'N/A'}</p>
                  <p><strong>Experience:</strong> {request.bio?.split(' with ')[1] || 'N/A'}</p>
                </div>
              </div>

              <div className="info-group">
                <label>Why do you need a mentor?</label>
                <div className="info-content">
                  <p>{request.reasonForMentorship || 'No information provided'}</p>
                </div>
              </div>

              <div className="info-group">
                <label>What is the most important factor for you right now?</label>
                <div className="info-content">
                  <p>{request.currentPriorities || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Message from Student</h2>
              <div className="info-group">
                <div className="info-content message-content">
                  <p>{request.message || 'No additional message provided'}</p>
                </div>
              </div>
            </div>

            {request.supportAreas && request.supportAreas.length > 0 && (
              <div className="form-section">
                <h2 className="section-title">Areas of Support Needed</h2>
                <div className="info-group">
                  <div className="support-areas">
                    {request.supportAreas.map((area, index) => (
                      <div key={index} className="support-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {request.attachedFiles && request.attachedFiles.length > 0 && (
              <div className="form-section">
                <h2 className="section-title">Attached Files</h2>
                <div className="info-group">
                  <div className="attached-files">
                    {request.attachedFiles.map((file, index) => (
                      <div key={index} className="file-card">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="12" y1="18" x2="12" y2="12"></line>
                          <line x1="9" y1="15" x2="15" y2="15"></line>
                        </svg>
                        <span className="file-name">{file.fileName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Student Profile */}
          <div className="request-profile-section">
            <div className="profile-card">
              <div className="profile-image">
                <img
                  src={request.student?.profileImage || request.studentProfile?.user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
                  alt={request.student?.name || 'Student'}
                />
              </div>
              <h3 className="profile-name">
                {request.student?.name || request.bio?.split(' - ')[0] || 'Student Name'}
              </h3>
              <p className="profile-role">
                {request.bio?.split(' - ')[1]?.split(' with ')[0] || 'Student'}
              </p>
              <p className="profile-bio">
                {request.reasonForMentorship?.substring(0, 120) || 'Passionate about learning and growth'}
                {request.reasonForMentorship?.length > 120 ? '...' : ''}
              </p>

              {request.contactInfo?.linkedIn && (
                <a
                  href={request.contactInfo.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  {request.student?.name?.toLowerCase().replace(/\s+/g, '-') || 'linkedin'}
                </a>
              )}

              <div className="request-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Requested on:</span>
                  <span className="metadata-value">
                    {new Date(request.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Status:</span>
                  <span className={`status-badge status-${request.status}`}>
                    {request.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="request-actions">
            <button className="decline-btn">
              Decline
            </button>
            <button className="accept-btn">
              Accept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequestView;
