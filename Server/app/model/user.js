const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
    role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  progress: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    },]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
