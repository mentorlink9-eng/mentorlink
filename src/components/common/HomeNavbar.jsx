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

  // Fetch profile image (for students)
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user?.role === "student") {
        try {
          const { studentAPI } = await import("../../services/api");
          const response = await studentAPI.getProfile();
          if (response.student?.profileImage) {
            setProfileImage(response.student.profileImage);
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };
    fetchProfileImage();
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

  // Navigate to user's profile page based on role (disabled for admins)
  const onProfileClick = () => {
    // Don't navigate for admin users
    if (user?.role === "admin") return;
    
    if (user?.role === "student") navigate("/student-profile");
    else if (user?.role === "organizer") navigate("/organizer-profile");
    else if (user?.role === "mentor") navigate("/mentor-profile");
    else navigate("/home");
  };

  // Navigate to home
  const goHome = () => navigate("/home");

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
        {/* Left: Hamburger (mobile only) + Logo */}
        <div className="navbar-left">
          {isMobile && (
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          )}
          <div
            className="navbar-logo"
            onClick={goHome}
            role="button"
            tabIndex={1000}
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

          {/* Dark Mode Toggle */}
          <button
            className="icon-btn theme-toggle"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Logout */}
          <button className="btn btn--ghost logout-btn" onClick={logout}>
            <FiLogOut size={18} />
          </button>

          {/* Profile Avatar */}
          <button className="avatar" onClick={onProfileClick} aria-label="Profile">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span role="img" aria-label="user">
                🧑
              </span>
            )}
          </button>
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
              <span>Menu</span>
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
