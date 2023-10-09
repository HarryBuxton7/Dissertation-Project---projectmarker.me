const PaperModel = require('../models/PaperModel');

module.exports = async (req, res) => {
  const {id} = req.params;
  const paper = await PaperModel.findOne({ _id: id });
  res.json(paper);
}