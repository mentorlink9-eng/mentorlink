import React from 'react';
import './PageSkeleton.css';

/**
 * Reusable skeleton loader for pages
 * @param {string} variant - 'profile' | 'event' | 'request'
 */
const PageSkeleton = ({ variant = 'profile' }) => {
  if (variant === 'profile') {
    return (
      <div className="page-skeleton">
        {/* Banner skeleton */}
        <div className="skel-banner shimmer" />

        {/* Avatar + Info */}
        <div className="skel-profile-header">
          <div className="skel-avatar shimmer" />
          <div className="skel-info">
            <div className="skel-line skel-line--lg shimmer" />
            <div className="skel-line skel-line--md shimmer" />
            <div className="skel-line skel-line--sm shimmer" />
          </div>
        </div>

        {/* Stats row */}
        <div className="skel-stats">
          <div className="skel-stat shimmer" />
          <div className="skel-stat shimmer" />
          <div className="skel-stat shimmer" />
        </div>

        {/* Content blocks */}
        <div className="skel-section">
          <div className="skel-line skel-line--lg shimmer" />
          <div className="skel-line skel-line--full shimmer" />
          <div className="skel-line skel-line--full shimmer" />
          <div className="skel-line skel-line--md shimmer" />
        </div>

        <div className="skel-section">
          <div className="skel-line skel-line--lg shimmer" />
          <div className="skel-chips">
            <div className="skel-chip shimmer" />
            <div className="skel-chip shimmer" />
            <div className="skel-chip shimmer" />
            <div className="skel-chip shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'event') {
    return (
      <div className="page-skeleton">
        {/* Event image skeleton */}
        <div className="skel-event-image shimmer" />

        {/* Event title + meta */}
        <div className="skel-event-header">
          <div className="skel-line skel-line--lg shimmer" />
          <div className="skel-line skel-line--md shimmer" />
        </div>

        {/* Event details */}
        <div className="skel-event-details">
          <div className="skel-detail-row">
            <div className="skel-icon shimmer" />
            <div className="skel-line skel-line--md shimmer" />
          </div>
          <div className="skel-detail-row">
            <div className="skel-icon shimmer" />
            <div className="skel-line skel-line--md shimmer" />
          </div>
          <div className="skel-detail-row">
            <div className="skel-icon shimmer" />
            <div className="skel-line skel-line--sm shimmer" />
          </div>
        </div>

        {/* Description */}
        <div className="skel-section">
          <div className="skel-line skel-line--lg shimmer" />
          <div className="skel-line skel-line--full shimmer" />
          <div className="skel-line skel-line--full shimmer" />
          <div className="skel-line skel-line--md shimmer" />
        </div>
      </div>
    );
  }

  if (variant === 'request') {
    return (
      <div className="page-skeleton">
        {/* Request card skeleton */}
        <div className="skel-request-card">
          <div className="skel-profile-header">
            <div className="skel-avatar skel-avatar--sm shimmer" />
            <div className="skel-info">
              <div className="skel-line skel-line--lg shimmer" />
              <div className="skel-line skel-line--sm shimmer" />
            </div>
          </div>

          <div className="skel-section">
            <div className="skel-line skel-line--full shimmer" />
            <div className="skel-line skel-line--full shimmer" />
            <div className="skel-line skel-line--md shimmer" />
          </div>

          <div className="skel-actions">
            <div className="skel-btn shimmer" />
            <div className="skel-btn shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PageSkeleton;
