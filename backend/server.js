/**
 * ============================================================================
 * LinguaCast - Enterprise AI Video Dubbing & Translation Platform
 * File: backend/server.js
 * Architecture: Node.js / Express (CommonJS Mode)
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// ----------------------------------------------------------------------------
// 1. إنشاء المجلدات التخزينية الأساسية تلقائياً
// ----------------------------------------------------------------------------
const DIRECTORIES = {
  uploads: path.join(__dirname, 'uploads'),
  outputs: path.join(__dirname, 'outputs'),
  temp: path.join(__dirname, 'temp')
};

Object.entries(DIRECTORIES).forEach(([name, dirPath]) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[Init] تم إنشاء مجلد ${name} بنجاح: ${dirPath}`);
  }
});

// ----------------------------------------------------------------------------
// 2. إعدادات CORS المتقدمة
// ----------------------------------------------------------------------------
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Range',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: [
    'Content-Range',
    'Accept-Ranges',
    'Content-Length',
    'Content-Type'
  ],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));

// ----------------------------------------------------------------------------
// 3. Middlewares لمعالجة الطلبات والـ Body
// ----------------------------------------------------------------------------
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Middleware لتسجيل الطلبات وحساب زمن الاستجابة
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 10);
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(
      `[${new Date().toISOString()}] [ID:${requestId}] ${req.method} ${req.originalUrl} ` +
      `${logColor}${res.statusCode}\x1b[0m - ${duration}ms`
    );
  });
  next();
});

// ----------------------------------------------------------------------------
// 4. محرك بث الفيديو المباشر HTTP 206 Partial Content
// ----------------------------------------------------------------------------
function streamMediaFile(filePath, req, res) {
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'ملف الميديا المطلوب غير موجود أو تم حذفه.'
    });
  }

  let stat;
  try {
    stat = fs.statSync(filePath);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'تعذر قراءة خصائص الملف' });
  }

  const fileSize = stat.size;
  const range = req.headers.range;
  const mimeType = filePath.endsWith('.mp4')
    ? 'video/mp4'
    : filePath.endsWith('.mp3')
    ? 'audio/mpeg'
    : filePath.endsWith('.wav')
    ? 'audio/wav'
    : 'video/mp4';

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      res.status(416).set({ 'Content-Range': `bytes */${fileSize}` });
      return res.end();
    }

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });

    fileStream.pipe(res);
    fileStream.on('error', (streamErr) => {
      console.error(`[Streaming Error] ID:${req.requestId} -`, streamErr.message);
      if (!res.headersSent) res.status(500).end();
    });
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on('error', (streamErr) => {
      console.error(`[Streaming Error] ID:${req.requestId} -`, streamErr.message);
      if (!res.headersSent) res.status(500).end();
    });
  }
}

// مسار بث الفيديوهات المعالجة المخرجة
app.get('/outputs/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const targetPath = path.join(DIRECTORIES.outputs, safeFilename);
  streamMediaFile(targetPath, req, res);
});

// مسار بث الفيديوهات الأصلية المرفوعة
app.get('/uploads/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const targetPath = path.join(DIRECTORIES.uploads, safeFilename);
  streamMediaFile(targetPath, req, res);
});

// إتاحة المجلدات كـ Static
app.use('/outputs', express.static(DIRECTORIES.outputs));
app.use('/uploads', express.static(DIRECTORIES.uploads));

// ----------------------------------------------------------------------------
// 5. ربط المسارات الأساسية (API Routes)
// ----------------------------------------------------------------------------
app.use('/api/video', videoRoutes);

// فحص جاهزية الخادم وحالته
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  res.status(200).json({
    status: 'online',
    platform: 'LinguaCast AI Dubbing Engine',
    uptimeSeconds: Math.floor(uptime),
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`
    },
    storage: {
      uploads: fs.readdirSync(DIRECTORIES.uploads).length,
      outputs: fs.readdirSync(DIRECTORIES.outputs).length
    },
    timestamp: new Date().toISOString()
  });
});

// مسار تنظيف الملفات المؤقتة تلقائياً
app.post('/api/system/cleanup', (req, res) => {
  try {
    let deletedCount = 0;
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000;

    [DIRECTORIES.uploads, DIRECTORIES.temp].forEach((dir) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(fullPath);
          deletedCount++;
        }
      });
    });

    res.json({ success: true, message: `تم تنظيف ${deletedCount} ملف مؤقت بنجاح.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 6. معالجة المسارات غير المعرفة والأخطاء العامة (Error Handling)
// ----------------------------------------------------------------------------
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'المسار المطلوب غير متوفر على خادم LinguaCast',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'حدث خطأ داخلي في الخادم',
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------------------------------
// 7. تشغيل السيرفر والإغلاق الآمن (Graceful Shutdown)
// ----------------------------------------------------------------------------
server.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log(`   __    _                            ___           _   `);
  console.log(`  / /   (_)___  ____ ___  ______ _   / __\\__ _ ___| |_ `);
  console.log(` / /   / / __ \\/ __ \`/ / / / __ \`/  / /  / _\` / __| __|`);
  console.log(`/ /___/ / / / / /_/ / /_/ / /_/ /  / /__| (_| \\__ \\ |_ `);
  console.log(`\\____/_/_/ /_/\\__, /\\__,_/\\__,_/   \\____/\\__,_|___/\\__|`);
  console.log(`             |___/                                      `);
  console.log('================================================================');
  console.log(` [STATUS]   LinguaCast Server Online: http://localhost:${PORT}`);
  console.log(` [HEALTH]   http://localhost:${PORT}/health`);
  console.log(` [STREAM]   http://localhost:${PORT}/outputs/:filename`);
  console.log('================================================================');
});

const handleGracefulShutdown = (signal) => {
  console.log(`\n[Shutdown] تم استلام إشارة ${signal}، جارٍ إغلاق السيرفر بأمان...`);
  server.close(() => {
    console.log('[Shutdown] تم إنهاء كافة الاتصالات وإغلاق الخادم بنجاح.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[Shutdown Error] تم فرض الإغلاق بعد انتهاء المهلة المحددة.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

module.exports = app;