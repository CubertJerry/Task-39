const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const mentorRoutes = require('./routes/mentor');
const studentRoutes = require('./routes/student');

const app = express();

mongoose.connect('mongodb://localhost:27017/mentor-student', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.json());

app.use('/mentors', mentorRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});