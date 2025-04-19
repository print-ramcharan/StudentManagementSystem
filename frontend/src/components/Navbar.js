// src/components/Navbar.js

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

function Navbar({ user }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const email = user?.email;
  const displayName = user?.displayName;
  const photoURL = user?.photoURL;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if click is outside the dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        .custom-navbar { background-color: #fff; padding: 0.8rem 1.5rem; font-family: 'Inter', sans-serif; }
        .custom-brand { font-size: 1.4rem; font-weight: 600; color: #6f42c1 !important; text-decoration: none; }
        .navbar-nav .nav-item { margin-left: 1.5rem; }
        .custom-link { font-size: 1rem; font-weight: 500; color: #555; transition: color 0.3s; }
        .custom-link:hover { color: #6f42c1; }
        .active-link { color: #6f42c1 !important; font-weight: 600; background: #f3edfa; border-radius: 6px; padding: 6px 10px; }
        .profile-img-sm { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; cursor: pointer; }
        .mobile-dropdown {
          position: absolute; top: 60px; right: 20px;
          background: #fff; border: 1px solid #ccc; border-radius: 10px;
          padding: 15px; width: 250px; box-shadow: 0 8px 16px rgba(0,0,0,0.1); z-index:1000;
        }
        .logout-btn {
          margin-top: 10px; width:100%; padding:8px;
          background:#dc3545; color:#fff; border:none; border-radius:6px; cursor:pointer;
        }
        .logout-btn:hover { background:#c82333; }
        @media (max-width:991px) { .d-lg-flex { display:none!important; } }
        @media (max-width:767px) { .custom-navbar { padding:0.6rem 1rem; } .profile-img-sm { width:40px; height:40px; } }
      `}</style>

      <nav className="navbar navbar-expand-lg bg-light shadow-sm fixed-top custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <NavLink className="navbar-brand custom-brand" to="/">Student Management</NavLink>

          {/* Desktop Links */}
          <ul className="navbar-nav ms-auto d-none d-lg-flex align-items-center">
            {['/', '/list-students', '/add-student', '/edit-student'].map((path, i) => {
              const labels = ['Home','Student List','Add Student','Edit Student'];
              return (
                <li key={path} className="nav-item px-2">
                  <NavLink
                    to={path}
                    className={({ isActive }) => isActive ? 'active-link nav-link' : 'custom-link nav-link'}
                  >
                    {labels[i]}
                  </NavLink>
                </li>
              );
            })}

            {user && (
              <li className="nav-item px-2 position-relative d-none d-lg-block">
                <img
                  src={photoURL||'https://via.placeholder.com/50'}
                  alt="Profile"
                  className="profile-img-sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div
                    className="mobile-dropdown"
                    ref={dropdownRef}
                    onMouseDown={e => e.stopPropagation()}  // ← STOP the mousedown from bubbling!
                  >
                    <div style={{ fontWeight:600, marginBottom:5 }}>{displayName}</div>
                    <div style={{ fontSize:'0.85rem', marginBottom:10, wordBreak:'break-word' }}>{email}</div>
                    <button
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Mobile Hamburger */}
          <button
            className="hamburger d-lg-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ☰
          </button>

          {/* Mobile Dropdown */}
          {isDropdownOpen && user && (
            <div
              className="mobile-dropdown d-lg-none"
              ref={dropdownRef}
              onMouseDown={e => e.stopPropagation()}  // ← same fix for mobile
            >
              {['/','/list-students','/add-student','/edit-student'].map((path,i) => {
                const labels = ['Home','Student List','Add Student','Edit Student'];
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => isActive ? 'dropdown-item active-link' : 'dropdown-item'}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {labels[i]}
                  </NavLink>
                );
              })}
              <hr/>
              <div className="d-flex align-items-center mb-2">
                <img src={photoURL||'https://via.placeholder.com/50'} className="profile-img-sm" alt="" />
                <div className="ms-2">
                  <div style={{ fontWeight:600 }}>{displayName}</div>
                  <div style={{ fontSize:'0.85rem', wordBreak:'break-word' }}>{email}</div>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
