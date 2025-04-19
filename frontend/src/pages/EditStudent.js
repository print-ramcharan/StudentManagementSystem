import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const departments = [
  'Computer Science and Engineering',
  'Civil Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Electronics and Communication Engineering',
  'CSE Artificial Intelligence',
  'CSE Data Science',
  'CSE Artificial Intelligence and Machine Learning',
  'Humanities & Sciences',
  'Master of Business Administration',
  'Diploma Courses'
];

const EditStudentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialStudent = location.state;

  const [studentData, setStudentData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    department: '',
    enrollmentYear: '',
    isActive: true,
  });

  const [originalData, setOriginalData] = useState(null);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [alertTimeout, setAlertTimeout] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (!initialStudent) {
      navigate('/list-students');
    } else {
      const formattedStudent = {
        ...initialStudent,
        dob: initialStudent.dob?.split('T')[0] || '',
      };
      setStudentData(formattedStudent);
      setOriginalData(formattedStudent);
    }
  }, [initialStudent, navigate]);

  const isDataChanged = () => {
    return JSON.stringify(studentData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (e.target.checkValidity() === false) {
      e.stopPropagation();
      setIsValid(false);
      return;
    }

    if (!isDataChanged()) {
      setMessage('No changes detected to update.');
      setAlertType('info');
      return;
    }
    <div className="d-flex justify-content-between align-items-center mb-3">
    <div>
      <h3 className="text-white" style={{ backgroundColor: '#6f42c1', padding: '10px', borderRadius: '8px' }}>Add New Student</h3>
    </div>
  </div>

    try {
      const res = await axios.put(`https://studentmanagementsystem-backend.onrender.com/students/${studentData.studentId}`, studentData);
      setMessage('Student data updated successfully!');
      setAlertType('success');
      setOriginalData(studentData);
    } catch (error) {
      setMessage(error.response?.data?.error || error.message);
      setAlertType('danger');
    }
  };
  
  const closeAlert = () => {
    clearTimeout(alertTimeout);
    setMessage('');
    setAlertType('');
  };

  useEffect(() => {
    if (message && alertType) {
      const timeout = setTimeout(() => {
        setMessage('');
        setAlertType('');
      }, 5000);
      setAlertTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [message, alertType]);

  const showAlert = message && alertType;

  return (
    <div className="container my-5">
      {showAlert && (
        <div className="alert-container" style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          width: '300px',
        }}>
          <div className={`alert alert-${alertType} shadow-sm mb-4 position-relative`} role="alert">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {alertType === 'success' ? (
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                ) : alertType === 'danger' ? (
                  <i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>
                ) : (
                  <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                )}
                <span>{message}</span>
              </div>
              <button type="button" className="btn-close custom-dark ms-2" onClick={closeAlert}  aria-label="Close"></button>
            </div>
            <div className="w-100 position-absolute bottom-0 start-0">
              <div className="progress-line"></div>
            </div>
          </div>
          <style>{`
            .progress-line {
              height: 4px;
              background-color: ${alertType === 'success' ? '#28a745' : alertType === 'danger' ? '#dc3545' : '#007bff'};
              animation: shrink 4s linear forwards;
              width: 100%;
              border-radius: 0 0 4px 4px;
            }
            @keyframes shrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
            .btn-close {
              filter: invert(1);
            }
          `}</style>
        </div>
      )}

      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-header text-white text-center" style={{ backgroundColor: '#6f42c1' }}>
              <h3>Edit Student</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate className={isValid ? '' : 'was-validated'}>
                <div className="mb-3">
                  <label className="form-label">Student ID</label>
                  <input type="text" className="form-control" name="studentId" value={studentData.studentId} readOnly />
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" name="firstName" value={studentData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" value={studentData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={studentData.email} onChange={handleChange} required />
                </div>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" name="dob" value={studentData.dob} onChange={handleChange} required />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Enrollment Year</label>
                    <input type="number" className="form-control" name="enrollmentYear" value={studentData.enrollmentYear} onChange={handleChange} required min="2000" max={new Date().getFullYear()} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select className="form-select" name="department" value={studentData.department} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox" name="isActive" checked={studentData.isActive} onChange={handleChange} />
                  <label className="form-check-label">Active</label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-lg text-white" style={{ backgroundColor: '#6f42c1' }}>
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudentForm;
