import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../cssFiles/navbar.css'; 

function Navbar({ user, setUser }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const email = user?.email;
  const displayName = user?.displayName;
  const photoURL = user?.photoURL;

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar navbar-expand-lg bg-light shadow-sm fixed-top custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <NavLink className="navbar-brand custom-brand" to="/">Student Management</NavLink>

          <ul className="navbar-nav ms-auto d-none d-lg-flex align-items-center">
  {['/', '/list-students', '/add-student', '/edit-student'].map((path, i) => {
    const labels = ['Home', 'Student List', 'Add Student', 'Edit Student'];
    return (
      <li key={path} className="nav-item px-2 fw-bold">
        <NavLink
          to={path}
          className={({ isActive }) =>
            isActive
              ? 'active-link nav-link'  
              : 'nav-link' 
          }
        >
          {labels[i]}
        </NavLink>
      </li>
    );
  })}


            {user && (
              <li className="nav-item px-2 position-relative d-none d-lg-block">
                <i
                  className="bi bi-person profile-img-sm"
                  style={{ fontSize: '32px', cursor: 'pointer' }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ></i>

                {isDropdownOpen && (
                  <div
                    className="mobile-dropdown"
                    ref={dropdownRef}
                    onMouseDown={e => e.stopPropagation()}
                  >
                    <div style={{ fontWeight:600, marginBottom:5 }}>{displayName}</div>
                    <div style={{ fontSize:'0.85rem', marginBottom:10, wordBreak:'break-word' }}>{email}</div>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          <button
            className="hamburger d-lg-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ☰
          </button>

          {isDropdownOpen && user && (
            <div
              className="mobile-dropdown d-lg-none"
              ref={dropdownRef}
              onMouseDown={e => e.stopPropagation()}
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
              <i
                  className="bi bi-person theme-color profile-img-sm"
                  style={{ fontSize: '32px', cursor: 'pointer', color: '#6f42c1' }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                ></i>
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
    </div>
  );
}

export default Navbar;
