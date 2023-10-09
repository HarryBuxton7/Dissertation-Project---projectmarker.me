const PaperModel = require("../models/PaperModel");
const UserModel = require("../models/UserModel");

module.exports = async (req, res) => {
  const { id } = req.params;
  const paper = await PaperModel.findById(id);

  console.log(paper)

  paper.inspectionFeedback = req.body.inspectionFeedback;
  paper.status = req.body.status;
  paper.outcomeOfDemonstration = req.body.outcomeOfDemonstration;
  paper.formativeFeedback = req.body.formativeFeedback;
  paper.concernsAboutTheProjectOrTheStudent = req.body.concernsAboutTheProjectOrTheStudent;
  paper.firstMarkerComment = req.body.firstMarkerComment;
  paper.secondMarkerComment = req.body.secondMarkerComment;
  paper.firstMarkerGrade = req.body.firstMarkerGrade;
  paper.secondMarkerGrade = req.body.secondMarkerGrade;
  paper.supervisorStudentFeedback = req.body.supervisorStudentFeedback;
  paper.thirdMarkerEmail = req.body.thirdMarker;
  paper.thirdMarkerComment = req.body.thirdMarkerComment;
  paper.thirdMarkerGrade = req.body.thirdMarkerGrade;
  paper.finalGrade = req.body.finalGrade;

  if (req.body.thirdMarkerEmail){
    console.log("##################################")
    const thirdMarker = await UserModel.findOne({ email: req.body.thirdMarkerEmail });
    paper.thirdMarkerID = thirdMarker._id;
    paper.thirdMarkerEmail = thirdMarker.email;
    paper.thirdMarkerName = thirdMarker.name;
    console.log("first paper:")
    console.log(paper)
  }

  if (paper.status == "Initial Blind Marking") {
    console.log("#######################################");
    if (paper.firstMarkerGrade && paper.secondMarkerGrade) {
      if (Math.abs(paper.firstMarkerGrade - paper.secondMarkerGrade) > 10) {
        paper.finalGrade = undefined;
        paper.status = "First Resolution";
      } else {
        paper.finalGrade =
          ((parseInt(paper.firstMarkerGrade) + parseInt(paper.secondMarkerGrade)) / 2).toString();
        paper.status = "Supervisor Feedback";
      }
    }
  }
  

  console.log(paper)

  await paper.save();
  res.json(paper);
};
