const PaperModel = require('../models/PaperModel');

module.exports = async (req, res) => {
    console.log("here")

  try {
    if (req.user.admin == true){
        const {id} = req.params;
        console.log(req.params)
        const result = await PaperModel.deleteOne({ _id: id });
        
        if (result.deletedCount === 1) {
          res.json({ message: "Successfully deleted paper" });
        } else {
          res.status(404).json({ message: "Paper not found" });
        }
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
