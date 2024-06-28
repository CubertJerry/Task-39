const Student = require('../models/student');
const Mentor = require('../models/mentor');

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAvailableStudents = async (req, res) => {
  try {
    const students = await Student.find({ mentor: null });
    res.status(200).send(students);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.assignOrChangeMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }

    if (student.mentor) {
      const oldMentor = await Mentor.findById(student.mentor);
      oldMentor.students.pull(studentId);
      await oldMentor.save();
    }

    const newMentor = await Mentor.findById(mentorId);
    if (!newMentor) {
      return res.status(404).send('Mentor not found');
    }

    student.mentor = mentorId;
    student.previousMentors.push(mentorId);
    await student.save();

    newMentor.students.push(studentId);
    await newMentor.save();

    res.status(200).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getPreviousMentorsForStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await Student.findById(studentId).populate('previousMentors');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student.previousMentors);
  } catch (err) {
    res.status(400).send(err);
  }
};