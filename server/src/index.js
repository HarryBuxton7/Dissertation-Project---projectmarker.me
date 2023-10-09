// index.js
//comment
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const isLoggedIn = require('./middleware/isLoggedIn');
const getGridFsStorage = require('./middleware/fileUpload');

const router = require('./router');
const connectDB = require('./db');

const PaperModel = require('./models/PaperModel');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  exposedHeaders: 'Content-Disposition',
}));
app.use(morgan('tiny'));

app.use(router);

let bucket;

connectDB()
  .then((connection) => {
    bucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: 'uploads',
      chunkSizeBytes: 1048576
    });

    console.log('starting on port 8080');
    app.listen(8080);
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error);
  });

const upload = getGridFsStorage(mongoose.connection);

app.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  try{
    let id = JSON.stringify(req.file.id)
    id = id.replace(/"/g, '');
    const paper = new PaperModel({
      fileID: id,
      fileName: req.file.originalname,
      studentID: req.body.studentID,
      firstMarkerID: req.body.firstMarkerID,
      firstMarkerEmail: req.body.firstMarkerEmail,
      secondMarkerID: req.body.secondMarkerID,
      secondMarkerEmail: req.body.secondMarkerEmail,
      needsAjudicating: false,
      //add studentID here
    })
    const newPaper = await paper.save();
    res.json(newPaper);
  } catch (err){
    res.json(err)
  }

});

app.get('/metadata', async (req, res) => {
  try {
    const cursor = bucket.find({});
    const filesMetadata = await cursor.toArray();
    res.json(filesMetadata);
  } catch (err) {
    res.json({ err: `Error: ${err.message}` });
  }
});

app.get('/metadata/:id', async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);
    const cursor = bucket.find({ _id });
    const filesMetadata = await cursor.toArray();
    res.json(filesMetadata[0] || null);
  } catch (err) {
    res.json({ err: `Error: ${err.message}` });
  }
});

app.get('/file/:id', async (req, res) => {
  try {
    const _id = mongoose.Types.ObjectId(req.params.id);
    const cursor = bucket.find({ _id });
    const filesMetadata = await cursor.toArray();
    if (!filesMetadata.length) return res.json({ err: 'Not a File!' });
    bucket.openDownloadStream(_id).pipe(res);
    res.type(filesMetadata[0].contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filesMetadata[0].filename}"`);
  } catch (err) {
    res.json({ err: `Error: ${err.message}` });
  }
});
