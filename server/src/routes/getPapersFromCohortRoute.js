const PaperModel = require("../models/PaperModel");

module.exports = async (req, res) => {
  console.log("here");
  let cohort = req.query.cohort;
  let year = cohort.replace(/[^0-9]/g, "");
  console.log(year);
  const papers = await PaperModel.find();

  if (
    req.query.cohort.toLowerCase().includes("conversion") ||
    req.query.cohort.toLowerCase().includes("bsc")
  ) {
    let bscPapers = papers
      .filter((paper) => paper.projectInspectionDate.slice(-4) === year)
      .filter(
        (paper) =>
          paper.projectType.toLowerCase().includes("conversion") ||
          paper.projectType.toLowerCase().includes("bsc")
      );
    console.log("bsc papers");
    console.log(bscPapers);
    res.json(bscPapers);
  } else if (req.query.cohort.toLowerCase().includes("msc")) {
    let mscPapers = papers
      .filter((paper) => paper.projectInspectionDate.slice(-4) === year)
      .filter(
        (paper) =>
          paper.projectType.toLowerCase().includes("msc") &&
          !paper.projectType.toLowerCase().includes("conversion")
      );
    console.log("msc papers");
    console.log(mscPapers);
    res.json(mscPapers);
  } else {
    res.json(undefined);
  }
};
