/**
 * ============================================================================
 * LinguaCast - Video Routing & Multer Upload Engine
 * File: backend/routes/videoRoutes.js
 * Architecture: Express Router (CommonJS Mode)
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {
  dubVideoController,
  getJobStatusController,
  getDubbingHistoryController,
  deleteOutputFileController
} = require('../controllers/videoController');

// ----------------------------------------------------------------------------
// 1. إعداد التخزين الآمن للملفات المرفوعة عبر Multer
// ----------------------------------------------------------------------------
const uploadsDirectory = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    // تنظيف اسم الملف وإنشاء بصمة فريدة
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const uniqueHash = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `input-${sanitizedBase}-${uniqueHash}${ext}`);
  }
});

// فلتر الملفات المقبولة (فيديو وصوت)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.mp3', '.wav', '.m4a'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  const allowedMimeTypes = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/x-m4a',
    'audio/mp4'
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم! الصيغ المدعومة هي: MP4, MOV, AVI, MKV, WebM, MP3, WAV'), false);
  }
};

// إعداد الحد الأقصى لحجم الملف (500 ميجابايت)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
    files: 1
  }
});

// Middleware لاحتواء أخطاء Multer وإرجاع استجابة JSON واضحة
const handleUploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('video');

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'حجم الملف يتجاوز الحد الأقصى المسموح به (500 ميجابايت).'
        });
      }
      return res.status(400).json({
        success: false,
        error: `خطأ أثناء رفع الملف: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next();
  });
};

// ----------------------------------------------------------------------------
// 2. تعريف المسارات (Endpoints)
// ----------------------------------------------------------------------------

// المسار الرئيسي للدبلجة والمعالجة العصبية
router.post('/dub', handleUploadMiddleware, dubVideoController);
router.post('/process', handleUploadMiddleware, dubVideoController);

// مسار فحص حالة المعالجة الحالية عبر Job ID
router.get('/status/:jobId', getJobStatusController);

// مسار جلب سجل الفيديوهات المعالجة السابقة
router.get('/history', getDubbingHistoryController);

// مسار حذف فيديو مخرج لتحرير المساحة
router.delete('/file/:filename', deleteOutputFileController);

module.exports = router;