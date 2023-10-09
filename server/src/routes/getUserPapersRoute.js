const PaperModel = require('../models/PaperModel');

module.exports = async (req, res) => {
  let papers;
  if (req.user.admin == false){
    papers = await PaperModel.find({
      $or: [
        { firstMarkerID: req.user.id }, 
        { secondMarkerID: req.user.id },
        { thirdMarkerID: req.user.id }
      ]
    });
    res.json(papers);
  } else {
    const papers = await PaperModel.find();
    res.json(papers)
    return
  }
}