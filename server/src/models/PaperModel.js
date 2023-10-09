const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  supervisors: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentID: {
    type: String,
    required: true,
  },
  degreeProgramme: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  projectInspectionDate: {
    type: String,
    required: true,
  },
  finalDemonstrationDate: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: String,
    required: true,
  },
  firstMarkerName: {
    type: String,
    required: true,
  },
  firstMarkerEmail: {
    type: String,
    required: true,
  },
  firstMarkerID: {
    type: String,
    required: true,
  },
  secondMarkerName: {
    type: String,
    required: true,
  },
  secondMarkerEmail: {
    type: String,
    required: true,
  },
  secondMarkerID: {
    type: String,
    required: true,
  },
  thirdMarkerName: {
    type: String,
    required: false,
  },
  thirdMarkerEmail: {
    type: String,
    required: false,
  },
  thirdMarkerID: {
    type: String,
    required: false,
  },
  linkToCanvasDownload: {
    type: String,
    required: true,
  },
  inspectionFeedback: {
    type: String,
    required: false,
  },
  outcomeOfDemonstration: {
    type: String,
    required: false,
  },
  formativeFeedback: {
    type: String,
    required: false,
  },
  concernsAboutTheProjectOrTheStudent: {
    type: String,
    required: false,
  },
  studentAbsent: {
    type: String,
    required: false,
  },
  firstMarkerComment: {
    type: String,
    required: false,
  },
  firstMarkerGrade: {
    type: String,
    required: false,
  },
  secondMarkerGrade: {
    type: String,
    required: false,
  },
  secondMarkerComment: {
    type: String,
    required: false,
  },
  thirdMarkerComment: {
    type: String,
    required: false,
  },
  thirdMarkerGrade: {
    type: String,
    required: false,
  },
  finalGrade: {
    type: String,
    required: false,
  },
  supervisorStudentFeedback: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  supervisorStudentFeedback: {
    type: String,
    required: false,
  }
});

const PaperModel = mongoose.model('Paper', PaperSchema);

module.exports = PaperModel;