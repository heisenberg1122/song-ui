import React, { useState } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { 
    searchQuery, setSearchQuery, 
    currentUser, setIsAuthModalOpen, logout,
    notifications, markNotificationsRead 
  } = useAppContext();
  
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value && window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsRead();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="header glass">
      <div className="search-container">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search OPM songs, albums, artists" 
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button className="icon-btn" onClick={handleBellClick}>
            <Bell size={22} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown glass">
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p className="no-notifications">No new notifications</p>
              ) : (
                <div className="notifications-list">
                  {notifications.map(note => (
                    <div key={note.id} className="notification-item">
                      <p>{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {currentUser ? (
          <div className="user-menu">
            <div className="profile-pic">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button className="signin-btn" onClick={() => setIsAuthModalOpen(true)}>
            <User size={18} />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
