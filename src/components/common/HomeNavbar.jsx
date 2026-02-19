import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun, FiMessageCircle, FiMenu, FiX, FiHome, FiUser, FiCalendar, FiUsers, FiSettings, FiShield } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import logoImage from "../../assets/mentorlink-logo.png";
import NotificationBell from "./NotificationBell";
import "./HomeNavbar.css";

const HomeNavbar = () => {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const { unreadCount } = useChat();
  const [dark, setDark] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 480);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDark(isDark);
    document.body.classList.toggle("dark-mode", isDark);
  }, []);

  // Fetch profile image based on role
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        if (user?.role === "student") {
          const { studentAPI } = await import("../../services/api");
          const response = await studentAPI.getProfile();
          if (response.student?.profileImage) {
            setProfileImage(response.student.profileImage);
          }
        } else if (user?.role === "mentor") {
          const { mentorAPI } = await import("../../services/api");
          const response = await mentorAPI.getProfile();
          if (response.mentor?.profileImage) {
            setProfileImage(response.mentor.profileImage);
          }
        } else if (user?.role === "organizer") {
          const { organizerAPI } = await import("../../services/api");
          const response = await organizerAPI.getProfile();
          if (response.organizer?.profileImage) {
            setProfileImage(response.organizer.profileImage);
          }
        }
      } catch (error) {
        // Profile image fetch failed silently
      }
    };
    if (user?.role) fetchProfileImage();
  }, [user?.role]);

  // Toggle dark/light mode
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle("dark-mode", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Logout
  const logout = () => {
    authLogout();
    navigate("/login");
  };

  // Navigate to user's profile page based on role
  const onProfileClick = () => {
    if (user?.role === "admin") return;
    if (user?.role === "student") navigate("/student-profile");
    else if (user?.role === "organizer") navigate("/organizer-profile");
    else if (user?.role === "mentor") navigate("/mentor-profile");
    else navigate("/home");
  };

  // Navigate to home
  const goHome = () => navigate("/home");

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Mobile menu navigation items
  const getMobileMenuItems = () => {
    let profilePath = "student-profile";
    if (user?.role === "organizer") profilePath = "organizer-profile";
    else if (user?.role === "mentor") profilePath = "mentor-profile";

    const items = [
      { icon: <FiHome />, label: "Home", path: "/home" },
      { icon: <FiMessageCircle />, label: "Messages", path: "/messages", badge: unreadCount },
      { icon: <FiCalendar />, label: "Events", path: "/events" },
      { icon: <FiUsers />, label: "Mentors", path: "/mentors" },
      { icon: <FiUsers />, label: "Students", path: "/students" },
      { icon: <FiSettings />, label: "Settings", path: "/settings" },
    ];

    if (user?.role === 'admin') {
      items.splice(1, 0, { icon: <FiShield />, label: "Admin", path: "/admin" });
    } else {
      items.splice(1, 0, { icon: <FiUser />, label: "Profile", path: `/${profilePath}` });
    }

    return items;
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-left">
          <div
            className="navbar-logo"
            onClick={goHome}
            role="button"
            tabIndex={0}
          >
            <img src={logoImage} alt="MentorLink Logo" className="logo-image" />
          </div>
        </div>

        {/* Right: Icons + Profile */}
        <div className="navbar-right">
          {/* Messages */}
          <button
            className="icon-btn messages-btn"
            onClick={() => navigate("/messages")}
            aria-label="Messages"
          >
            <FiMessageCircle size={20} />
            {unreadCount > 0 && (
              <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* Dark Mode Toggle - hidden on mobile */}
          <button
            className="icon-btn theme-toggle hide-mobile"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Logout - hidden on mobile */}
          <button className="btn btn--ghost logout-btn hide-mobile" onClick={logout}>
            <FiLogOut size={18} />
          </button>

          {/* Profile Avatar */}
          <button className="avatar" onClick={onProfileClick} aria-label="Profile">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="avatar-img"
              />
            ) : (
              <span className="avatar-initials">{getInitials()}</span>
            )}
          </button>

          {/* Hamburger Menu - mobile only */}
          {isMobile && (
            <button
              className="icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              {/* Profile info in drawer header */}
              <div className="mobile-menu-user">
                <div className="mobile-menu-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="avatar-img" />
                  ) : (
                    <span className="avatar-initials">{getInitials()}</span>
                  )}
                </div>
                <div className="mobile-menu-user-info">
                  <span className="mobile-menu-user-name">{user?.name || 'User'}</span>
                  <span className="mobile-menu-user-role">{user?.role || ''}</span>
                </div>
              </div>
              <button
                className="mobile-menu-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={20} />
              </button>
            </div>
            <ul className="mobile-menu-list">
              {getMobileMenuItems().map((item, idx) => (
                <li key={idx}>
                  <button
                    className="mobile-menu-item"
                    onClick={() => handleMobileNavClick(item.path)}
                  >
                    <span className="mobile-menu-icon">{item.icon}</span>
                    <span className="mobile-menu-label">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="mobile-menu-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              ))}
              {/* Dark mode toggle in menu */}
              <li>
                <button className="mobile-menu-item" onClick={toggleDark}>
                  <span className="mobile-menu-icon">{dark ? <FiSun /> : <FiMoon />}</span>
                  <span className="mobile-menu-label">{dark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </li>
            </ul>
            <div className="mobile-menu-footer">
              <button
                className="mobile-menu-item mobile-menu-item--danger"
                onClick={logout}
              >
                <span className="mobile-menu-icon"><FiLogOut /></span>
                <span className="mobile-menu-label">Logout</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default HomeNavbar;
