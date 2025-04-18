// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import EditStudentForm from './pages/EditStudent';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);

      if (!authUser && location.pathname !== '/login') {
        navigate('/login');
      }

      if (authUser && location.pathname === '/login') {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [location.pathname, navigate]);

  return (
    <>
      {user && <Navbar user={user} />}
      <br/>
      <br/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/list-students" element={user ? <StudentList /> : <Login />} />
        <Route path="/add-student" element={user ? <AddStudent /> : <Login />} />
        <Route path="/edit-student" element={user ? <EditStudentForm /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
