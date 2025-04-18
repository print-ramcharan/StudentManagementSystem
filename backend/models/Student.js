const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9]+$/, 
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/,
  },
  dob: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
    enum: [
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
      'Diploma Courses',
    ],
  },
  enrollmentYear: {
    type: Number,
    required: true,
    min: 2000,
    max: currentYear,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
},this.collection = 'students');

module.exports = mongoose.model('Student', studentSchema);
