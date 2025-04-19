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

  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
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
    <>
      <style>{`
        .custom-navbar {
          background-color: #fff;
          padding: 0.8rem 1.5rem;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          border-bottom: none !important;
          box-shadow: none !important;
          height: auto;
        }

        .custom-brand {
          font-size: 1.4rem;
          font-weight: 600;
          color: #6f42c1 !important;
          text-decoration: none;
        }

        .navbar-nav .nav-item {
          margin-left: 1.5rem;
        }

        .custom-link {
          font-size: 1rem;
          font-weight: 500;
          color: #555;
          text-decoration: none !important;
          transition: color 0.3s ease;
          position: relative;
        }

        .custom-link:hover {
          color: #6f42c1;
        }

        .active-link {
          color: #6f42c1 !important;
          font-weight: 600;
        }

        .profile-img-sm {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          cursor: pointer;
        }

        .mobile-dropdown {
          position: absolute;
          top: 60px;
          right: 20px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 15px;
          width: 250px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .dropdown-item {
          display: block;
          padding: 6px 0;
          color: #333;
          text-decoration: none;
        }

        .dropdown-item:hover {
          color: #6f42c1;
        }

        .logout-btn {
          margin-top: 10px;
          width: 100%;
          padding: 8px 10px;
          background-color: #dc3545;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background-color: #c82333;
        }
        .active-link {
  color: #6f42c1 !important;
  font-weight: 600;
  background-color: #f3edfa;
  border-radius: 6px;
  padding: 6px 10px;
}

        .hamburger {
          display: none;
          font-size: 24px;
          background: none;
          border: none;
          color: #6f42c1;
        }

        @media (max-width: 991px) {
          .d-lg-flex {
            display: none !important;
          }
          .hamburger {
            display: block;
          }
        }

        @media (max-width: 767px) {
          .custom-navbar {
            padding: 0.6rem 1rem;
          }

          .profile-img-sm {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg bg-light shadow-sm fixed-top custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <NavLink className="navbar-brand fw-bold custom-brand" to="/">Student Management</NavLink>

          {/* Nav links for large screens */}
          <ul className="navbar-nav ms-auto d-none d-lg-flex align-items-center">
            <li className="nav-item px-2">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : 'custom-link'}`}>Home</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink to="/list-students" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : 'custom-link'}`}>Student List</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink to="/add-student" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : 'custom-link'}`}>Add Student</NavLink>
            </li>
            <li className="nav-item px-2">
              <NavLink to="/edit-student" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : 'custom-link'}`}>Edit Student</NavLink>
            </li>

            {user && (
              <li className="nav-item px-2 position-relative d-none d-lg-block">
                <img
                  src={photoURL || 'https://via.placeholder.com/50'}
                  alt="Profile"
                  className="profile-img-sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="mobile-dropdown" ref={dropdownRef}>
                    <div style={{ fontWeight: 600, marginBottom: '5px' }}>{displayName}</div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '10px', wordBreak: 'break-word' }}>{email}</div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* Hamburger for small screens */}
          <button className="hamburger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            ☰
          </button>

          {/* Dropdown Menu on Small Screens */}
          {isDropdownOpen && (
            <div className="mobile-dropdown d-lg-none" ref={dropdownRef}>
              <NavLink to="/" className={({ isActive }) => `dropdown-item ${isActive ? 'active-link' : ''}`} onClick={() => setIsDropdownOpen(false)}>Home</NavLink>
<NavLink to="/list-students" className={({ isActive }) => `dropdown-item ${isActive ? 'active-link' : ''}`} onClick={() => setIsDropdownOpen(false)}>Student List</NavLink>
<NavLink to="/add-student" className={({ isActive }) => `dropdown-item ${isActive ? 'active-link' : ''}`} onClick={() => setIsDropdownOpen(false)}>Add Student</NavLink>
<NavLink to="/edit-student" className={({ isActive }) => `dropdown-item ${isActive ? 'active-link' : ''}`} onClick={() => setIsDropdownOpen(false)}>Edit Student</NavLink>

              {user && (
                <>
                  <hr />
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={photoURL || 'https://via.placeholder.com/50'}
                      alt="Profile"
                      className="profile-img-sm"
                    />
                    <div className="ms-2">
                      <div style={{ fontWeight: 600 }}>{displayName}</div>
                      <div style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>{email}</div>
                    </div>
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
