import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { FaSearch, FaFileUpload } from 'react-icons/fa';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://studentmanagementsystem-backend.onrender.com/students');
      setStudents(response.data);
      setFilteredStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching student data');
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    navigate('/edit-student', { state: student });
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    try {
      await axios.delete(`https://studentmanagementsystem-backend.onrender.com/students/${studentToDelete.studentId}`);
      const updated = students.filter(s => s.studentId !== studentToDelete.studentId);
      setStudents(updated);
      setFilteredStudents(updated);
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setShowModal(false);
      setStudentToDelete(null);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredStudents(
      students.filter(s =>
        (`${s.firstName} ${s.lastName}`.toLowerCase().includes(value) || s.email.toLowerCase().includes(value))
      )
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

      for (const student of data) {
        try {
          await axios.post('http://localhost:6969/students', student);
        } catch (error) {
          console.error('Error uploading student:', error);
        }
      }

      fetchStudents(); // Reload updated data
    };
    reader.readAsBinaryString(file);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5 pt-0">
      <h2 className="mb-4 text-center">Student List</h2>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
       
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <span className="input-group-text" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

      
        <div>
          <label className="btn btn-outline-primary" style={{ borderColor: '#6f42c1', color: '#6f42c1' }}>
            <FaFileUpload className="me-2" />
            Upload Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="table-responsive-sm">
        <table className="table table-bordered table-hover" style={{ color: '#6f42c1' }}>
          <thead>
            <tr style={{ backgroundColor: '#6f42c1', color: 'white' }}>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Department</th>
              <th>Enrollment Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.email}</td>
                <td>{new Date(student.dob).toLocaleDateString()}</td>
                <td>{student.department}</td>
                <td>{student.enrollmentYear}</td>
                <td>{student.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <div className="btn-group" role="group">
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(student)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && studentToDelete && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{studentToDelete.firstName} {studentToDelete.lastName}</strong>?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
