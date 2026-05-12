import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './AuthModal.css';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAppContext();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      // In a real app, we would validate credentials here.
      // For this mock, any username creates a valid session.
      login(username);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>
          <X size={24} />
        </button>
        
        <h2 className="modal-title">{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="modal-subtitle">
          {isLoginView ? 'Sign in to sync your playlists and liked songs.' : 'Join OPM Vibe to save your favorite tracks.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLoginView ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer">
          {isLoginView ? (
            <p>Don't have an account? <span onClick={() => setIsLoginView(false)}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setIsLoginView(true)}>Sign In</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
