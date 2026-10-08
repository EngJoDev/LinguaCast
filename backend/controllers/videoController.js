/**
 * ============================================================================
 * LinguaCast - Video Dubbing & AI Pipeline Controller
 * File: backend/controllers/videoController.js
 * Architecture: Controller (CommonJS Mode)
 * ============================================================================
 */

const path = require('path');
const fs = require('fs');
const { spawn, spawnSync } = require('child_process');

// خريطة تتبع المهام الحية في الذاكرة
const activeJobs = new Map();

/**
 * دالة استكشاف أمر بايثون المتاح في النظام (Windows/Linux/macOS)
 */
function getPythonExecutable() {
  const candidates = ['python3', 'python', 'py'];
  for (const cmd of candidates) {
    try {
      const result = spawnSync(cmd, ['--version']);
      if (result.status === 0) {
        return cmd;
      }
    } catch (e) {
      // تابع البحث
    }
  }
  return 'python3';
}

/**
 * المتحكم الرئيسي لمعالجة ودبلجة الفيديو
 */
const dubVideoController = async (req, res) => {
  const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'لم يتم استلام أي ملف فيديو. يرجى التأكد من رفع ملف بصيغة صحيحة.'
    });
  }

  const inputPath = req.file.path;
  const originalFilename = req.file.originalname;
  const uniqueTimestamp = Date.now();
  const outputFilename = `linguacast_dubbed_${uniqueTimestamp}.mp4`;
  const outputPath = path.join(__dirname, '..', 'outputs', outputFilename);
  const pythonScriptPath = path.join(__dirname, '..', 'process_video.py');

  const targetLang = req.body.targetLang || 'ar-SA';
  const gender = (req.body.gender || 'male').toLowerCase();
  const tone = (req.body.tone || 'neutral').toLowerCase();
  const speed = req.body.speed ? String(req.body.speed) : '1.0';
  const pitch = req.body.pitch ? String(req.body.pitch) : '0';
  const ducking = req.body.ducking ? String(req.body.ducking) : '80';
  const lipSync = req.body.lipSync || 'high';
  const keepBgMusic = req.body.keepBgMusic !== 'false' && req.body.keepBackgroundMusic !== 'false' ? 'true' : 'false';

  console.log(`\n========================================================`);
  console.log(`[LinguaCast] بدء مهمة دبلجة جديدة [ID: ${jobId}]`);
  console.log(` - الملف المدخل: ${originalFilename} (${req.file.size} bytes)`);
  console.log(` - اللغة المستهدفة: ${targetLang}`);
  console.log(` - الصوت: ${gender} | الطابع: ${tone} | السرعة: ${speed}x`);
  console.log(`========================================================`);

  if (!fs.existsSync(pythonScriptPath)) {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return res.status(500).json({
      success: false,
      error: `سكريبت المعالجة غير موجود في المسار: ${pythonScriptPath}`
    });
  }

  activeJobs.set(jobId, {
    jobId,
    status: 'processing',
    progress: 5,
    startedAt: new Date().toISOString(),
    targetLang,
    inputPath,
    outputPath
  });

  const pythonExec = getPythonExecutable();
  console.log(`[Python Engine] استخدام المفسر: "${pythonExec}"`);

  const pythonArgs = [
    pythonScriptPath,
    '--input', inputPath,
    '--output', outputPath,
    '--lang', targetLang,
    '--gender', gender,
    '--tone', tone,
    '--speed', speed,
    '--pitch', pitch,
    '--ducking', ducking,
    '--lip-sync', lipSync,
    '--keep-bg', keepBgMusic
  ];

  const pythonProcess = spawn(pythonExec, pythonArgs, {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
  });

  let stdoutLogs = '';
  let stderrLogs = '';

  pythonProcess.stdout.on('data', (data) => {
    const text = data.toString();
    stdoutLogs += text;
    const lines = text.trim().split('\n');
    lines.forEach((line) => {
      console.log(`\x1b[36m[Python STDOUT]\x1b[0m ${line}`);
      if (line.includes('[PROGRESS:')) {
        const match = line.match(/\[PROGRESS:\s*(\d+)%\]/);
        if (match && match[1]) {
          const currentJob = activeJobs.get(jobId);
          if (currentJob) {
            currentJob.progress = parseInt(match[1], 10);
          }
        }
      }
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    const text = data.toString();
    stderrLogs += text;
    const lines = text.trim().split('\n');
    lines.forEach((line) => {
      console.error(`\x1b[33m[Python LOG]\x1b[0m ${line}`);
    });
  });

  pythonProcess.on('error', (spawnErr) => {
    console.error(`[Process Error] فشل إطلاق مفسر بايثون:`, spawnErr);
    if (fs.existsSync(inputPath)) {
      try { fs.unlinkSync(inputPath); } catch (e) {}
    }
    activeJobs.delete(jobId);

    return res.status(500).json({
      success: false,
      error: 'فشل في تشغيل بيئة بايثون لمعالجة الفيديو.',
      details: spawnErr.message
    });
  });

  pythonProcess.on('close', (exitCode) => {
    if (fs.existsSync(inputPath)) {
      try {
        fs.unlinkSync(inputPath);
        console.log(`[Cleanup] تم حذف الملف المؤقت: ${inputPath}`);
      } catch (cleanErr) {
        console.warn(`[Cleanup Warning] تعذر حذف الملف المؤقت:`, cleanErr.message);
      }
    }

    if (exitCode !== 0) {
      console.error(`[LinguaCast Error] انتهت المعالجة بكود خطأ: ${exitCode}`);
      activeJobs.set(jobId, { status: 'failed', error: stderrLogs || stdoutLogs });

      return res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء دبلجة الفيديو.',
        details: stderrLogs || stdoutLogs,
        exitCode: exitCode
      });
    }

    if (!fs.existsSync(outputPath)) {
      return res.status(500).json({
        success: false,
        error: 'فشلت المعالجة في تصدير ملف الفيديو النهائي.',
        details: stderrLogs
      });
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host') || `localhost:5000`;
    const fullVideoUrl = `${protocol}://${host}/outputs/${outputFilename}`;
    const outputStats = fs.statSync(outputPath);

    console.log(`\x1b[32m[LinguaCast Success]\x1b[0m تم إنتاج الفيديو بنجاح: ${fullVideoUrl}`);

    activeJobs.set(jobId, {
      status: 'completed',
      progress: 100,
      videoUrl: fullVideoUrl,
      filename: outputFilename,
      completedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'تمت دبلجة وترجمة الفيديو بنجاح.',
      jobId: jobId,
      videoUrl: fullVideoUrl,
      filename: outputFilename,
      sizeBytes: outputStats.size,
      sizeFormatted: `${(outputStats.size / (1024 * 1024)).toFixed(2)} MB`,
      targetLang: targetLang,
      voiceSettings: { gender, tone, speed }
    });
  });
};

/**
 * فحص حالة مهمة معالجة معينة عبر الـ ID
 */
const getJobStatusController = (req, res) => {
  const { jobId } = req.params;
  const job = activeJobs.get(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      error: 'المهمة المطلوبة غير موجودة أو انتهت صلاحيتها.'
    });
  }

  return res.status(200).json({
    success: true,
    job
  });
};

/**
 * جلب سجل الفيديوهات المعالجة
 */
const getDubbingHistoryController = (req, res) => {
  try {
    const outputsDir = path.join(__dirname, '..', 'outputs');
    if (!fs.existsSync(outputsDir)) {
      return res.status(200).json({ success: true, history: [] });
    }

    const files = fs.readdirSync(outputsDir);
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';

    const history = files
      .filter((file) => file.endsWith('.mp4') || file.endsWith('.webm'))
      .map((file) => {
        const filePath = path.join(outputsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          videoUrl: `${protocol}://${host}/outputs/${file}`,
          sizeBytes: stats.size,
          sizeFormatted: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
          createdAt: stats.birthtime || stats.mtime
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'فشل في استرجاع سجل الفيديوهات: ' + error.message
    });
  }
};

/**
 * حذف ملف فيديو مخرج
 */
const deleteOutputFileController = (req, res) => {
  try {
    const safeFilename = path.basename(req.params.filename);
    const targetPath = path.join(__dirname, '..', 'outputs', safeFilename);

    if (!fs.existsSync(targetPath)) {
      return res.status(404).json({
        success: false,
        error: 'الملف المطلوب حذفه غير موجود.'
      });
    }

    fs.unlinkSync(targetPath);
    console.log(`[Deleted] تم حذف ملف الفيديو: ${safeFilename}`);

    return res.status(200).json({
      success: true,
      message: `تم حذف الملف ${safeFilename} بنجاح.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'فشل حذف الملف: ' + error.message
    });
  }
};

module.exports = {
  dubVideoController,
  getJobStatusController,
  getDubbingHistoryController,
  deleteOutputFileController
};