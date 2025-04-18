const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

//get All students data
router.get('/', async (req, res) => {
    try{
        const students = await Student.find();
        if(!students || students.length === 0) return res.status(404).json({ message: 'No students found' });
        res.json(students);
    }catch(err){
        res.status(500).json({ error: err.message });
    }   
})
//get student data based on id
router.get('/:studentId', async (req, res) => {
    try{
        const students = await Student.findOne({ studentId: req.params.studentId });
        if(!students) return res.status(404).json({ message: 'Student not found' });
        res.json(students);
    }catch(err){
        res.status(400).json({ error: err.message });
    }   
})
//Adding student (New student)
router.post('/', async (req, res) => {
    try{
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

//update student data.
router.put('/:studentId', async (req, res) => {
    try{
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId: req.params.studentId },
            req.body,
            { new: true }
        );
        if(!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})
//delete student data
router.delete('/:studentId', async (req, res) => {
    try{
        const deletedStudent = await Student.findOneAndDelete({ studentId: req.params.studentId });
        if(!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
})
module.exports = router;