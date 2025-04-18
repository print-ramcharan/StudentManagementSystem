import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileUpload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const AddStudentForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  const [secondsLeft, setSecondsLeft] = useState(4);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    dob: '',
    enrollmentYear: '',
    department: '',
    isActive: false
  });

  const [isValid, setIsValid] = useState(true);
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

  const themeColor = '#6f42c1';
  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (showAlert) {
      setSecondsLeft(4);
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowAlert(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [showAlert]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      setIsValid(false);
      form.classList.add('was-validated');
      return;
    }

    setIsValid(true);
    try {
      await axios.post('http://localhost:6969/students', formData);
      setMessage('Student added successfully!');
      setAlertType('success');
      setShowAlert(true);
      form.classList.remove('was-validated');
    } catch (error) {
      setMessage(error.response ? error.response.data.error : error.message);
      setAlertType('danger');
      setShowAlert(true);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      try {
        for (const student of data) {
          await axios.post('http://localhost:6969/students', student);
        }
        setMessage('Students added successfully!');
        setAlertType('success');
        setShowAlert(true);
      } catch (error) {
        setMessage(error.response ? error.response.data.error : error.message);
        setAlertType('danger');
        setShowAlert(true);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  return (
    <div className="container my-5">
      {showAlert && (
        <div className={`alert alert-${alertType} shadow-sm mt-3 position-relative`} role="alert">
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
            <div className="d-flex align-items-center">
              <span className="text-muted me-2 small">{secondsLeft}s</span>
              <button
                type="button"
                className="btn-close"
                onClick={closeAlert}
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div className="w-100 position-absolute bottom-0 start-0">
            <div className="progress-line"></div>
          </div>
          <style>{`
            .progress-line {
              height: 4px;
              background-color: ${
                alertType === 'success'
                  ? '#28a745'
                  : alertType === 'danger'
                  ? '#dc3545'
                  : '#007bff'
              };
              animation: shrink 4s linear forwards;
              width: 100%;
              border-radius: 0 0 4px 4px;
            }

            @keyframes shrink {
              0% { width: 100%; }
              100% { width: 0%; }
            }
          `}</style>
        </div>
      )}

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
            style={{ color: activeTab === 'manual' ? themeColor : '#000' }}
          >
            Manual Entry
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
            style={{ color: activeTab === 'upload' ? themeColor : '#000' }}
          >
            File Upload
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'manual' && (
          <div className="tab-pane fade show active">
            <h3 style={{ color: themeColor }}>Manual Student Entry</h3>
            <div className="row">
              <div className="col-md-8 offset-md-2 pt-0">
                <div
                  className="card shadow"
                  style={{
                    backgroundColor: '#f9f5ff',
                    border: `1px solid ${themeColor}`,
                  }}
                >
                  <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate className={isValid ? '' : 'was-validated'}>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="mb-3 col-md-5">
                          <label className="form-label" style={{ color: themeColor }}>First Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            minLength="2"
                          />
                          <div className="invalid-feedback">First Name is required and must be at least 2 characters.</div>
                        </div>

                        <div className="mb-3 col-md-5">
                          <label className="form-label" style={{ color: themeColor }}>Last Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            minLength="2"
                          />
                          <div className="invalid-feedback">Last Name is required and must be at least 2 characters.</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label" style={{ color: themeColor }}>Student ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          required
                          pattern="^[a-zA-Z0-9]+$"
                        />
                        <div className="invalid-feedback">Student ID is required and must be alphanumeric.</div>
                      </div>

                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label className="form-label" style={{ color: themeColor }}>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            pattern="^\S+@\S+\.\S+$"
                          />
                          <div className="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div className="mb-3 col-md-6">
                          <label className="form-label" style={{ color: themeColor }}>Date of Birth</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                          />
                          <div className="invalid-feedback">Date of Birth is required.</div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="mb-3 col-md-6">
                          <label className="form-label" style={{ color: themeColor }}>Enrollment Year</label>
                          <input
                            type="number"
                            className="form-control"
                            name="enrollmentYear"
                            value={formData.enrollmentYear}
                            onChange={handleChange}
                            min="2000"
                            max={new Date().getFullYear()}
                            required
                          />
                          <div className="invalid-feedback">Enrollment Year is required and must be valid.</div>
                        </div>

                        <div className="mb-3 col-md-6">
                          <label htmlFor="department" className="form-label" style={{ color: themeColor }}>
                            Department
                          </label><br/>
                          <select
                            id="department"
                            className="form-select form-select-lg mb-3" aria-label=".form-select-lg"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                              <option key={dep} value={dep}>
                                {dep}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-check form-switch mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="isActive" style={{ color: themeColor }}>
                          Is Active
                        </label>
                      </div>

                      <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: themeColor }}>
                        Add Student
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="tab-pane fade show active">
            <h3 style={{ color: themeColor }}>Upload Students Data</h3>
            <div className="row">
              <div className="col-md-8 offset-md-2 pt-0">
                <div
                  className="card shadow"
                  style={{
                    backgroundColor: '#f9f5ff',
                    border: `1px solid ${themeColor}`,
                  }}
                >
                  <div className="card-body text-center">
                    <label htmlFor="file-upload" className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center py-4">
                      <FaFileUpload size={40} className="me-3" /> Upload File
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="d-none"
                      accept=".xls, .xlsx"
                      onChange={handleFileUpload}
                    />
                    {file && <p className="mt-3">{file.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudentForm;
