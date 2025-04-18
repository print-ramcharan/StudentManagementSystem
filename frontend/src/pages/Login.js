import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // For managing the modal state

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:6969/users/login-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Login failed');
        return;
      }

      // ✅ Store and navigate
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setErrorMsg('Login error: ' + error.message);
      console.error('Manual login failed:', error.message);
    }
  };

  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log('Google login successful:', user);
    
    // Close the modal after successful login
    setIsModalOpen(false); 

    navigate('/');  // Navigate to the home page
  } catch (error) {
    console.error('Google login failed:', error.message);
    setErrorMsg('Google login failed, please try again');
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
            <label className="form-label text-primary">Email address</label>
            <input
              type="email"
              className="form-control border-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-primary">Password</label>
            <input
              type="password"
              className="form-control border-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            <i className="bi bi-box-arrow-in-right me-2"></i>Login
          </button>
        </form>

        <div className="text-center text-muted mb-2">or</div>

        <button
          onClick={() => setIsModalOpen(true)} // Open the modal on button click
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-google"></i> Sign in with Google
        </button>

        {/* Google Login Modal */}
        {isModalOpen && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="googleLoginModal" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="googleLoginModal">Sign in with Google</h5>
                  <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Proceed to login with your Google account</p>
                  <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="bi bi-google"></i> Login with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Your account will only be used for authentication purposes.
        </p>
      </div>
    </div>
  );
}

export default Login;
