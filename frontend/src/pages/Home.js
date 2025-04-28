import React from 'react';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div className="container mt-5 pt-5">
      <div className="theme-bg text-white rounded-4 shadow-lg p-5 mb-4">
        <h1 className="display-4 fw-bold">Welcome to the Student Management System.</h1>
        <p className="lead">Manage your student data efficiently and effectively.</p>
        <hr className="my-4 border-light" />
        <p>Navigate through the portal to view, add, or edit student information.</p>
        <Link className="btn btn-light btn-lg" to="/list-students" role="button">View Students</Link>
      </div>
    </div>
  );
}

export default Home;
