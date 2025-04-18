
const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/student_management_system')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use('/students', studentRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});