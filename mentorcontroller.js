const Mentor = require('../models/mentor');
const Student = require('../models/student');

exports.createMentor = async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.assignStudentsToMentor = async (req, res) => {
  try {
    const { mentorId, studentIds } = req.body;
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }

    for (let studentId of studentIds) {
      let student = await Student.findById(studentId);
      if (student && !student.mentor) {
        student.mentor = mentorId;
        student.previousMentors.push(mentorId);
        await student.save();
        mentor.students.push(studentId);
      }
    }
    await mentor.save();
    res.status(200).send(mentor);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getStudentsForMentor = async (req, res) => {
  try {
    const mentorId = req.params.mentorId;
    const mentor = await Mentor.findById(mentorId).populate('students');
    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }
    res.status(200).send(mentor.students);
  } catch (err) {
    res.status(400).send(err);
  }
};