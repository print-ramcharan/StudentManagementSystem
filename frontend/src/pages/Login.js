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

  // Manual email/password login
  const handleManualLogin = async (e) => {
    console.log('[handleManualLogin] start', { email, password });
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      console.log('[handleManualLogin] validation failed');
      setErrorMsg('Please enter both email and password');
      return;
    }

    try {
      console.log('[handleManualLogin] sending request to backend');
      const response = await fetch(
        'https://studentmanagementsystem-backend.onrender.com/users/login-auth',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      console.log('[handleManualLogin] response status:', response.status);
      const data = await response.json();
      console.log('[handleManualLogin] response data:', data);

      if (!response.ok) {
        console.log('[handleManualLogin] backend login failed');
        setErrorMsg(data.message || 'Login failed');
        return;
      }

      console.log('[handleManualLogin] login success, storing tokens');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error) {
      console.error('[handleManualLogin] error:', error);
      setErrorMsg('Login error: ' + error.message);
    }
  };

  // Microsoft OAuth login
  const handleMicrosoftLogin = async () => {
    console.log('[handleMicrosoftLogin] start');
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('User.Read');
    provider.setCustomParameters({
      tenant: '8ba02f42-a433-4ad5-bdab-0103a1bc5fa5' // your Tenant ID
    });
    console.log('[handleMicrosoftLogin] provider configured', {
      scope: provider.scopes,
      tenant: '8ba02f42-a433-4ad5-bdab-0103a1bc5fa5'
    });

    try {
      console.log('[handleMicrosoftLogin] calling signInWithPopup');
      const result = await signInWithPopup(auth, provider);
      console.log('[handleMicrosoftLogin] signInWithPopup result:', result);

      const credential = OAuthProvider.credentialFromResult(result);
      if (!credential) {
        console.warn('[handleMicrosoftLogin] no credential returned');
        throw new Error('No OAuth credential returned');
      }
      console.log('[handleMicrosoftLogin] credential:', credential);

      const accessToken = credential.accessToken;
      console.log('[handleMicrosoftLogin] accessToken:', accessToken);

      // Fetch binary profile photo from Microsoft Graph
      console.log('[handleMicrosoftLogin] fetching profile photo');
      const photoResp = await fetch(
        'https://graph.microsoft.com/v1.0/me/photo/$value',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log('[handleMicrosoftLogin] photo response status:', photoResp.status, photoResp);

      if (photoResp.ok) {
        const blob = await photoResp.blob();
        const photoURL = URL.createObjectURL(blob);
        console.log('Blob:', blob, 'type:', blob.type, 'size:', blob.size);
      
        console.log('[handleMicrosoftLogin] photoURL created:', photoURL);

        // Update Firebase user profile with photoURL
        await updateProfile(auth.currentUser, { photoURL });

        console.log('[handleMicrosoftLogin] Firebase profile updated with photoURL');
      } else {
        console.warn('[handleMicrosoftLogin] no profile photo or Graph API error', photoResp.status);
      }

      console.log('[handleMicrosoftLogin] Microsoft login successful, user:', result.user);
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
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-microsoft"></i> Sign in with Microsoft
        </button>

        <p className="mt-4 text-center text-muted" style={{ fontSize: '0.9rem' }}>
          Your account will only be used for authentication purposes.
        </p>
      </div>
    </div>
  );
}

export default Login;
