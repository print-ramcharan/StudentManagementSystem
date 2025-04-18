const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true 
  },
  photoURL: {
    type: String,
    default: '' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, this.collection = 'users');

module.exports = mongoose.model('User', userSchema);
