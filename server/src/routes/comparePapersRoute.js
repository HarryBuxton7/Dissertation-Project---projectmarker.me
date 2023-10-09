const PaperModel = require("../models/PaperModel");

module.exports = async (req, res) => {
  console.log("here");
  console.log(req.query);

  let searchCriteria = {
    firstMarkerGrade: parseInt(req.query.firstMarkerGrade),
    secondMarkerGrade: parseInt(req.query.secondMarkerGrade),
    projectType: req.query.projectType,
    degreeProgramme: req.query.degreeProgramme,
    currentPaperId: req.query.currentPaperId, // Assuming you pass this in the request
  };

  if (req.user.admin === false) {
    let papers = await PaperModel.find({
      status: "Completed", // Filtering by status "Completed"
      _id: { $ne: searchCriteria.currentPaperId }, // Exclude the current paper
    }).lean();

    
    const searchType = searchCriteria.projectType.toLowerCase();
    let filteredPapers = [];

    if (searchType.includes("conversion") || searchType.includes("bsc")) {
      filteredPapers = papers.filter(paper => {
        const paperType = paper.projectType.toLowerCase();
        return paperType.includes("conversion") || paperType.includes("bsc");
      });
    } else if (searchType.includes("msc")) {
      filteredPapers = papers.filter(paper => {
        const paperType = paper.projectType.toLowerCase();
        return paperType.includes("msc") && !paperType.includes("conversion");
      });
    }
    papersWithSameProgram = []
    filteredPapers.forEach(paper => {
      if (paper.degreeProgramme === searchCriteria.degreeProgramme) {
        papersWithSameProgram.push(paper);
      }
    })
    papersWithSameProgram1st = [...papersWithSameProgram]; // create a shallow copy using spread syntax
    papersWithSameProgram1st.sort((a, b) => {
        const diffA = Math.abs(a.finalGrade - searchCriteria.firstMarkerGrade);
        const diffB = Math.abs(b.finalGrade - searchCriteria.firstMarkerGrade);
        return diffA - diffB;
    });
    
    papersWithSameProgram2nd = [...papersWithSameProgram]; // create another shallow copy
    papersWithSameProgram2nd.sort((a, b) => {
        const diffA = Math.abs(a.finalGrade - searchCriteria.secondMarkerGrade);
        const diffB = Math.abs(b.finalGrade - searchCriteria.secondMarkerGrade);
        return diffA - diffB;
    });
    console.log(searchCriteria.firstMarkerGrade)
    console.log(papersWithSameProgram1st);
    res.json({
      papersWithSameProgram1st: papersWithSameProgram1st,
      papersWithSameProgram2nd: papersWithSameProgram2nd
  });
  } else {
    res.json(null);
    return;
  }
};