const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mlController = require("../controllers/mlController");

// إعداد التخزين لضمان حفظ الملف بامتداد صحيح (.mp4)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.post("/transcribe", mlController.transcribeAudio);
router.post("/dub", upload.any(), mlController.transcribeAudio);

router.post("/speak", mlController.speakText);
router.get("/speak", mlController.speakText);

module.exports = router;
