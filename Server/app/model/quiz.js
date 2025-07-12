const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [array => array.length >= 2, 'At least two options are required.']
  },
  correctAnswer: {
    type: Number,
    required: true,
    validate: {
      validator: function (val) {
        return val >= 0;
      },
      message: 'correctAnswer must be a valid index.'
    }
  }
}, { _id: false });

const quizSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
