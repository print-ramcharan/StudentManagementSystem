import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      const response = await fetch(
        'https://studentmanagementsystem-backend.onrender.com/users/login-auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      setErrorMsg('Login error: ' + error.message);
    }
  };

  const handleMicrosoftLogin = async () => {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('User.Read');
    provider.setCustomParameters({
      tenant: '8ba02f42-a433-4ad5-bdab-0103a1bc5fa5'
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      if (!userEmail.endsWith('@cbit.org.in')) {
        setErrorMsg('Only @cbit.org.in emails are allowed.');
        return;
      }

      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken) {
        const photoResp = await fetch(
          'https://graph.microsoft.com/v1.0/me/photo/$value',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (photoResp.ok) {
          const blob = await photoResp.blob();
          const photoURL = URL.createObjectURL(blob);
          await updateProfile(auth.currentUser, { photoURL });
        }
      }

      navigate('/');
    } catch (error) {
      console.error('[handleMicrosoftLogin] failed:', error);
      setErrorMsg('Microsoft login failed, please try again');
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
            <i className="bi bi-box-arrow-in-right me-2"></i> Login
          </button>
        </form>

        <div className="text-center text-muted mb-2">or</div>
        <button
          onClick={handleMicrosoftLogin}
          style={{ backgroundColor: '#6f42c1', color: '#fff', border: 'none' }}
          className="btn w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-microsoft"></i> Sign in with Microsoft
        </button>

        <p className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Only <strong>@cbit.org.in</strong> accounts are allowed. <br />
          Your account will only be used for authentication purposes.
        </p>
      </div>
    </div>
  );
}

export default Login;
