import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5 pt-5">
      <div className="jumbotron bg-primary text-white rounded-lg shadow-lg p-5 mb-4">
        <h1 className="display-4">Welcome to the Student Management System.</h1>
        <p className="lead">Manage your student data efficiently and effectively.</p>
        <hr className="my-4" />
        <p>Navigate through the portal to view, add, or edit student information.</p>
        <Link className="btn btn-light btn-lg" to="/list-students" role="button">View Students</Link>
      </div>
    </div>
  );
}

export default Home;
