// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/login.css'
function Login({ onLogin }) {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (email === 'admin' && password === 'admin') {
      onLogin({ email: 'admin' }); // simple object to represent user
      navigate('/');
    } else {
      setErrorMsg('Incorrect email or password. Please try again.');
    }
  };

  return (
    <div className="container-fluid bg-light d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-3 text-primary">Welcome Back</h3>
        <p className="text-center text-muted mb-4">
          Login to continue to the <strong>Student Management System</strong>
        </p>

        {errorMsg && (
          <div className="alert alert-danger text-center py-2">{errorMsg}</div>
        )}

        <form onSubmit={handleManualLogin}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username (admin)"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password (admin)"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Use <strong>admin</strong> as username and password for login.
        </p>
      </div>
    </div>
  );
}

export default Login;
