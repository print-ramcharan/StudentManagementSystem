// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
    if (user && location.pathname === '/login') {
      navigate('/');
    }
  }, [location.pathname, navigate, user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <>
     {user && <Navbar user={user} setUser={setUser} />}

      <br/>
      <br/>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Home /> : <Login onLogin={handleLogin} />} />
        <Route path="/list-students" element={user ? <StudentList /> : <Login onLogin={handleLogin} />} />
        <Route path="/add-student" element={user ? <AddStudent /> : <Login onLogin={handleLogin} />} />
        <Route path="/edit-student" element={user ? <EditStudentForm /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
}

export default App;
