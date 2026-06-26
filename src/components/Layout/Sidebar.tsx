import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { state: auth, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">♞</div>
          <span className="logo-text">ChessMaster</span>
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </NavLink>
        <NavLink to="/play" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">♟️</span>
          <span className="nav-text">Play</span>
        </NavLink>
        <NavLink to="/puzzles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🧩</span>
          <span className="nav-text">Puzzles</span>
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🔍</span>
          <span className="nav-text">Analysis</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {auth.isLoggedIn && auth.currentUser ? (
          <div className="user-profile">
            <div className="user-avatar">
              {auth.currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="username">{auth.currentUser.username}</span>
              <span className="rating">{auth.currentUser.rating}</span>
            </div>
            <button className="logout-btn btn-ghost" onClick={logout} title="Logout">
              🚪
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary" style={{ width: '100%', padding: '8px' }}>
            {collapsed ? '👤' : 'Log In / Sign Up'}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
