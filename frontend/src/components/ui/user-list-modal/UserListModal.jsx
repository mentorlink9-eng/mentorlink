import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserListModal.css";

const UserListModal = ({ isOpen, onClose, title, fetchUsers, currentUserId }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchUsers()
      .then((data) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUserClick = (user) => {
    onClose();
    const role = user.role?.toLowerCase();
    if (role === "mentor") navigate(`/mentor-profile/${user._id}`);
    else if (role === "student") navigate(`/student-profile/${user._id}`);
    else if (role === "organizer") navigate(`/organizer-profile`);
    else navigate(`/mentor-profile/${user._id}`);
  };

  return (
    <div className="ulm-overlay" onClick={onClose}>
      <div className="ulm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ulm-header">
          <h3 className="ulm-title">{title}</h3>
          <button className="ulm-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="ulm-body">
          {loading ? (
            <div className="ulm-loading">Loading...</div>
          ) : users.length === 0 ? (
            <div className="ulm-empty">No users found.</div>
          ) : (
            <ul className="ulm-list">
              {users.map((u) => (
                <li key={u._id} className="ulm-item" onClick={() => handleUserClick(u)}>
                  <div className="ulm-avatar">
                    {u.profileImage ? (
                      <img src={u.profileImage} alt={u.name} className="ulm-avatar-img" />
                    ) : (
                      <span className="ulm-avatar-initials">
                        {u.name ? u.name[0].toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <div className="ulm-info">
                    <span className="ulm-name">{u.name || "Unknown"}</span>
                    <span className="ulm-role">{u.role || ""}</span>
                  </div>
                  <div className="ulm-badges">
                    {u.isMutual && <span className="ulm-mutual-badge">Mutual</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
