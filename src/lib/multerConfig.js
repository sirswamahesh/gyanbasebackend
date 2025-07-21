const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); 
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;

        const fileUrl = `${process.env.HOST_NAME}/uploads/${uniqueFilename}`;
        file.location = fileUrl;

        cb(null, uniqueFilename);
    },
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = upload;
