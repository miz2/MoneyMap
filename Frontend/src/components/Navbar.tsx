import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth0, LogoutOptions } from '@auth0/auth0-react';
import MenuIcon from './MenuIcon';
import CloseIcon from './CloseIcon';
import Logo from "./Logo";

const Navbar: React.FC = () => {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Logo />
      </div>

      <input type="checkbox" id="sidebar-active" className="sidebar-toggle" />

      <label htmlFor="sidebar-active" className="open-sidebar-button" aria-label="Open Menu">
        <MenuIcon />
      </label>

      <label htmlFor="sidebar-active" id="overlay" aria-label="Close Menu"></label>

      <div className="links-container">
        <label htmlFor="sidebar-active" className="close-sidebar-button" aria-label="Close Menu">
          <CloseIcon />
        </label>
        <Link className="home-link" to="/">Home</Link>
        <Link to="/about">About</Link> {/* About Link */}
        <Link to="/investments">Investments</Link> {/* New Investments Link */}
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <>
            {isAuthenticated ? (
              <div className="auth-actions">
                <button
                  className="button"
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin } as LogoutOptions,
                    })
                  }
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <button className="button" onClick={() => loginWithRedirect()}>
                  Sign In
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
