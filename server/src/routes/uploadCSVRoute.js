const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');
const upload = multer({ dest: 'tmp/csv/' });
const PaperModel = require('../models/PaperModel');
const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {
    upload.single('file')(req, res, async function(err) {
        if (err) {
            // An error occurred when uploading
            return res.status(400).send('Error uploading file.');
        }

        const fileRows = [];
        const errors = [];

        csv.parseFile(req.file.path)
            .on("data", function (row) {
                fileRows.push(row); 
            })
            .on("end", async function () {
                fs.unlinkSync(req.file.path);   // remove temp csv file
                for (let index = 0; index < fileRows.length; index++) {
                    if (index > 0) {
                        try {
                            await createPaper(fileRows[index][0]);
                        } catch (err) {
                            console.error(`Error processing row ${index}: ${err}`);
                            errors.push({ row: index, student: fileRows[index][0].split(";")[2], error: err.message });
                        }
                    }
                }
                res.json({ fileRows, errors });
            });
    });
};

async function createPaper(row){
    // Split row by semi-colon
    columnNumber = row.split(";")
    /*
    columnNumber.forEach((column, index) => {
        columnNumber[index] = column.replace(" ", "");
    });
*/

    // Attempt to find users by email
    const firstMarker = await UserModel.findOne({ email: columnNumber[9] });
    const secondMarker = await UserModel.findOne({ email: columnNumber[11] });

    // Check if users were found, if not, throw an error
    if (!firstMarker) {
        throw new Error(`User not found with email ${columnNumber[9]}`);
    }
    if (!secondMarker) {
        throw new Error(`User not found with email ${columnNumber[11]}`);
    }

    // Create new Paper
    const paper = new PaperModel({
        supervisors: columnNumber[0],
        studentName: columnNumber[1],
        studentID: columnNumber[2],
        degreeProgramme: columnNumber[3],
        projectType: columnNumber[4],
        projectInspectionDate: columnNumber[5],
        finalDemonstrationDate: columnNumber[6],
        submissionDate: columnNumber[7],
        firstMarkerName: columnNumber[8],
        firstMarkerEmail: columnNumber[9],
        firstMarkerID: firstMarker._id,
        secondMarkerName: columnNumber[10],
        secondMarkerEmail: columnNumber[11],
        secondMarkerID: secondMarker._id,
        linkToCanvasDownload: columnNumber[12],
        status: "Project Inspection"
    })

    const newPaper = await paper.save();
    console.log("new paper created")
}
