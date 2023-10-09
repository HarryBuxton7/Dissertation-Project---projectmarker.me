const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

module.exports = (connection) => {
  const storage = new GridFsStorage({
    db: connection,
    file: (req, file) => ({
      filename: `${file.originalname}_${Date.now()}`,
      bucketName: 'uploads',
      chunkSize: 500000,
      metadata: { uploadedBy: req.studentID, downloadCount: 4 }
    })
  });

  return multer({ storage });
};
