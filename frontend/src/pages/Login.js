import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helper function to format date in 12-hour format
  const formatDate = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    const minute = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${hour}:${minute} ${ampm}`;
    return formattedTime;
  };

  // Manual login using email and password
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Format the login time to 12-hour format
      const loginTime = formatDate(new Date());

      // Save login timestamp and user data to Firestore under a date-wise collection
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const loginDocRef = collection(db, 'users', user.uid, 'logins', today, 'entries');

      await addDoc(loginDocRef, {
        name: user.displayName || '',
        email: user.email,
        uid: user.uid,
        loginTime,
        timestamp: new Date().toISOString(), // Store the exact timestamp
      });

      navigate('/');
    } catch (error) {
      console.error('[handleManualLogin] failed:', error);
      setErrorMsg('Incorrect email or password. Please try again.');
    }
  };

  // Microsoft login using OAuth
  const handleMicrosoftLogin = async () => {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('User.Read');
    provider.setCustomParameters({
      tenant: '8ba02f42-a433-4ad5-bdab-0103a1bc5fa5',
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken) {
        const photoResp = await fetch(
          'https://graph.microsoft.com/v1.0/me/photo/$value',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (photoResp.ok) {
          const blob = await photoResp.blob();
          const photoURL = URL.createObjectURL(blob);
          await updateProfile(auth.currentUser, { photoURL });
        }
      }

      const loginTime = formatDate(new Date());
      const today = new Date().toISOString().split('T')[0]; // e.g., "2025-04-20"

      // ✅ Create path: users/{uid}/logins/{today}/entries/{autoId}
      const loginCollectionRef = collection(
        db,
        `users/${user.uid}/logins/${today}/entries`
      );

      await addDoc(loginCollectionRef, {
        name: user.displayName || '',
        email: user.email,
        uid: user.uid,
        loginTime,
        timestamp: new Date().toISOString(),
      });

      navigate('/');
    } catch (error) {
      console.error('[handleMicrosoftLogin] failed:', error);
      setErrorMsg('Microsoft login failed, please try again.');
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

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
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

        <div className="text-center text-muted my-2">or</div>

        {/* Microsoft Login Button */}
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
