import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
const outputsDir = path.join(__dirname, '../outputs');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

// السماح للمتصفح بتشغيل واستعراض الفيديو
app.use('/outputs', cors(), express.static(outputsDir, {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const handleDubbing = (req: express.Request, res: express.Response) => {
  if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

  const inputPath = req.file.path;
  const outputFilename = `dubbed-${Date.now()}.mp4`;
  const outputPath = path.join(outputsDir, outputFilename);
  const targetLang = req.body.language || 'ar';

  const pythonBin = path.join(__dirname, '../venv/bin/python');
  const scriptPath = path.join(__dirname, 'scripts/process_video.py');

  console.log(`🚀 بدء معالجة الفيديو عبر Python: ${req.file.originalname}`);

  exec(`"${pythonBin}" "${scriptPath}" "${inputPath}" "${targetLang}" "${outputPath}"`, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    if (error) {
      console.error('❌ خطأ أثناء تشغيل Python:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }

    const fullVideoUrl = `http://localhost:5000/outputs/${outputFilename}`;

    res.json({
      success: true,
      videoUrl: fullVideoUrl,
      url: fullVideoUrl,
      video_url: fullVideoUrl,
      downloadUrl: fullVideoUrl,
      outputUrl: fullVideoUrl,
      video: fullVideoUrl,
      data: {
        url: fullVideoUrl,
        videoUrl: fullVideoUrl,
        dubbedVideoUrl: fullVideoUrl,
        downloadUrl: fullVideoUrl
      }
    });
  });
};

// المسارات المدعومة (تم إضافة /api/dubbing/start لحل مشكلة 404)
app.post('/api/dubbing/start', upload.single('video'), handleDubbing);
app.post('/api/videos/upload', upload.single('video'), handleDubbing);
app.post('/api/dub', upload.single('video'), handleDubbing);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});