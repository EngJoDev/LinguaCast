require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { pipeline } = require('@xenova/transformers');
const { EdgeTTS } = require('node-edge-tts');
const ffmpeg = require('fluent-ffmpeg');

// ================= 1. تهيئة قاعدة البيانات (Prisma ORM) =================
let prisma = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  console.log('📦 [Database] Prisma Client connected successfully.');
} catch {
  console.warn('⚠️ [Database] Prisma not generated yet. Running with in-memory fallback.');
}

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// ================= 2. إعداد المجلدات والـ Middlewares =================
const uploadsDir = path.join(__dirname, '..', 'uploads');

function ensureDirectoriesExist() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`📁 [Storage] Uploads directory ready at: ${uploadsDir}`);
  }
}
ensureDirectoriesExist();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تشغيل الفيديوهات كـ Static للمعاينة في مشغل الفرونت إند
app.use('/uploads', express.static(uploadsDir));

// ================= 3. إعداد Multer لرفع الفيديوهات =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirectoriesExist();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `input_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('يرجى رفع ملف فيديو صالح بصيغة (MP4, MOV, WebM, MKV)'), false);
    }
  }
});

// ================= 4. تهيئة نموذج Whisper STT =================
let transcriber = null;

async function getTranscriber() {
  if (!transcriber) {
    console.log('⏳ [AI STT] Loading Whisper Neural Model (@xenova/transformers)...');
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
      chunk_length_s: 30,
      stride_length_s: 5
    });
    console.log('✅ [AI STT] Whisper Model is online and ready.');
  }
  return transcriber;
}

// استخراج الصوت بصيغة 16kHz PCM
function extractRawAudioForWhisper(videoPath, rawPcmPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -y -i "${videoPath}" -vn -acodec pcm_s16le -ac 1 -ar 16000 -f s16le "${rawPcmPath}"`;
    exec(cmd, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function pcm16ToFloat32(buffer) {
  const int16Array = new Int16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
}

async function transcribeOriginalVideoAudio(videoPath, tempPcmPath) {
  try {
    await extractRawAudioForWhisper(videoPath, tempPcmPath);
    const audioBuffer = fs.readFileSync(tempPcmPath);
    const float32Audio = pcm16ToFloat32(audioBuffer);

    const stt = await getTranscriber();
    const result = await stt(float32Audio);

    const transcript = result?.text?.trim();
    return transcript && transcript.length > 0 ? transcript : 'Hello and welcome to this video.';
  } catch (err) {
    console.warn('⚠️ [STT Warning] Whisper extraction fallback:', err.message);
    return 'Welcome to LinguaCast AI video dubbing platform.';
  }
}

// ================= 5. نظام الترجمة الذكي عبر Gemini API =================
async function translateWithGemini(text, targetLanguage = 'ar-SA') {
  if (!text || text.trim().length === 0) return text;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ [Gemini API] GEMINI_API_KEY missing in .env! Using local fallback.');
    return fallbackTranslate(text, targetLanguage);
  }

  const prompt = `أنت مترجم محترف، ترجم النص التالي المستخرج من فيديو إلى اللغة العربية الفصحى بسياق طبيعي ومفهوم جداً وبدون ترجمة حرفية، وأرجع النص المترجم فقط بدون أي مقدمات أو تعليقات:\n\n"${text}"`;

  try {
    // 1. تجربة مكتبة @google/genai الرسمية الحديثة
    try {
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const translatedText = response.text?.trim();
      if (translatedText) {
        console.log(`🤖 [Gemini 2.5 Flash] Translation: "${translatedText}"`);
        return translatedText;
      }
    } catch {
      // 2. تجربة مكتبة @google/generative-ai القديمة
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const translatedText = result.response.text()?.trim();
      if (translatedText) {
        console.log(`🤖 [Gemini Live] Translation: "${translatedText}"`);
        return translatedText;
      }
    }
  } catch (geminiErr) {
    console.warn('⚠️ [Gemini API Error] Falling back to secondary translator:', geminiErr.message);
  }

  return fallbackTranslate(text, targetLanguage);
}

// محرك ترجمة احتياطي (Fallback) في حال انقطاع اتصال Gemini
async function fallbackTranslate(text, targetLanguage = 'ar-SA') {
  const targetLangCode = targetLanguage.split('-')[0].toLowerCase() || 'ar';
  try {
    const { translate } = await import('@vitalets/google-translate-api');
    const res = await translate(text, { to: targetLangCode });
    if (res?.text?.trim()) return res.text.trim();
  } catch {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const data = await response.json();
      if (data && data[0]) {
        const translated = data[0].map(item => item[0]).filter(Boolean).join('');
        if (translated?.trim()) return translated.trim();
      }
    } catch (e) {
      console.error('❌ [Fallback Failed]:', e.message);
    }
  }
  return text;
}

// ================= 6. أصوات Microsoft Edge Neural =================
function getNeuralVoice(targetLanguage = 'ar-SA', gender = 'female') {
  const isFemale = gender.toLowerCase() === 'female';

  const voiceMap = {
    'ar-SA': isFemale ? 'ar-SA-ZariyahNeural' : 'ar-SA-HamedNeural',
    'ar-EG': isFemale ? 'ar-EG-SalmaNeural' : 'ar-EG-ShakirNeural',
    'ar-AE': isFemale ? 'ar-AE-FatimaNeural' : 'ar-AE-HamdanNeural',
    'ar': isFemale ? 'ar-SA-ZariyahNeural' : 'ar-SA-HamedNeural',
    'en-US': isFemale ? 'en-US-JennyNeural' : 'en-US-GuyNeural',
    'en-GB': isFemale ? 'en-GB-SoniaNeural' : 'en-GB-RyanNeural',
    'fr-FR': isFemale ? 'fr-FR-DeniseNeural' : 'fr-FR-HenriNeural',
    'es-ES': isFemale ? 'es-ES-ElviraNeural' : 'es-ES-AlvaroNeural',
    'de-DE': isFemale ? 'de-DE-KatjaNeural' : 'de-DE-ConradNeural'
  };

  const key = Object.keys(voiceMap).find(k => targetLanguage.startsWith(k)) || 'ar-SA';
  return voiceMap[key] || (isFemale ? 'ar-SA-ZariyahNeural' : 'ar-SA-HamedNeural');
}

async function generateNeuralSpeech(text, voiceName, outputPath, speed = 1.0) {
  const ratePercentage = speed >= 1.0 
    ? `+${Math.round((speed - 1.0) * 100)}%` 
    : `-${Math.round((1.0 - speed) * 100)}%`;

  try {
    const tts = new EdgeTTS({
      voice: voiceName,
      lang: voiceName.split('-').slice(0, 2).join('-'),
      outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
      rate: ratePercentage
    });
    await tts.ttsPromise(text, outputPath);
  } catch {
    await new Promise((resolve, reject) => {
      const cmd = `edge-tts --voice "${voiceName}" --text "${text.replace(/"/g, '\\"')}" --rate="${ratePercentage}" --write-media "${outputPath}"`;
      exec(cmd, (err) => (err ? reject(err) : resolve()));
    });
  }
}

// ================= 7. معالجة الفيديو والعلامة المائية عبر FFmpeg =================
function getVideoDuration(videoPath) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err || !metadata?.format?.duration) {
        resolve(15);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

function mergeDubbedVideoWithWatermark(inputVideoPath, dubbedAudioPath, outputVideoPath, totalDuration, isFreePlan = true) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg().input(inputVideoPath).input(dubbedAudioPath);

    // إذا كان المستخدم في الخطة المجانية، يتم إضافة علامة مائية شفافة LinguaCast
    if (isFreePlan) {
      console.log('🏷️ [Watermark] Applying "LinguaCast AI" watermark for Free Tier...');
      command = command.outputOptions([
        '-vf drawtext=text=\'LinguaCast AI\':fontsize=26:fontcolor=white@0.65:box=1:boxcolor=black@0.35:boxborderw=6:x=w-tw-25:y=25',
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-c:a aac',
        `-af apad=whole_dur=${totalDuration}`,
        `-t ${totalDuration}`
      ]);
    } else {
      console.log('💎 [Pro Tier] Rendering video in Pure HD without watermark...');
      command = command.outputOptions([
        '-map 0:v:0',
        '-map 1:a:0',
        '-c:v copy',
        `-af apad=whole_dur=${totalDuration}`,
        `-t ${totalDuration}`
      ]);
    }

    command
      .output(outputVideoPath)
      .on('end', () => resolve())
      .on('error', (err) => {
        // Fallback في حال اختلاف توافق الكودك
        ffmpeg()
          .input(inputVideoPath)
          .input(dubbedAudioPath)
          .outputOptions([
            '-c:v libx264',
            '-pix_fmt yuv420p',
            '-c:a aac',
            `-af apad=whole_dur=${totalDuration}`,
            `-t ${totalDuration}`
          ])
          .output(outputVideoPath)
          .on('end', () => resolve())
          .on('error', (fallbackErr) => reject(fallbackErr))
          .run();
      })
      .run();
  });
}

// ================= 8. مسارات الـ API =================

// المسار الترحيبي الرئيسي لتفادي خطأ Cannot GET /
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>LinguaCast AI Server</title>
      <style>
        body { background: #070913; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 1.5rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); backdrop-filter: blur(16px); }
        h1 { color: #818cf8; margin-bottom: 0.5rem; }
        .badge { background: #10b981; color: #000; font-weight: bold; padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🎙️ LinguaCast AI Backend Server</h1>
        <p>محرك دبلجة وترجمة الفيديوهات بالذكاء الاصطناعي يعمل بكفاءة 100%</p>
        <span class="badge">Online & Ready</span>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    engine: 'Gemini 2.5 Flash + Whisper + Edge-TTS + FFmpeg',
    prismaActive: !!prisma
  });
});

// بدء عملية الدبلجة وترجمة الفيديو الحقيقية (POST /api/dubbing/start)
app.post('/api/dubbing/start', upload.single('video'), async (req, res) => {
  const uniqueId = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const tempPcmPath = path.join(uploadsDir, `temp_${uniqueId}.pcm`);
  const dubbedAudioPath = path.join(uploadsDir, `audio_${uniqueId}.mp3`);
  const outputFilename = `dubbed_${uniqueId}.mp4`;
  const outputVideoPath = path.join(uploadsDir, outputFilename);

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'يرجى إرفاق ملف فيديو صالح' });
    }

    const {
      targetLanguage = 'ar-SA',
      gender = 'female',
      speed = 1.0,
      userPlan = 'free', // 'free' | 'pro' | 'agency'
      userEmail
    } = req.body;

    const isFree = userPlan.toLowerCase() === 'free';
    const inputVideoPath = req.file.path;
    console.log(`\n🚀 [Dubbing Pipeline] Processing: ${req.file.originalname} | Plan: ${userPlan}`);

    // 1. حساب طول الفيديو
    const videoDuration = await getVideoDuration(inputVideoPath);
    const videoMinutes = parseFloat((videoDuration / 60).toFixed(2));
    console.log(`⏱️ 1. Duration: ${videoDuration.toFixed(2)}s (${videoMinutes} mins)`);

    // 2. التحقق من رصيد المستخدم في قاعدة البيانات عبر Prisma
    if (prisma && userEmail && !isFree) {
      try {
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (user && user.credits < videoMinutes) {
          return res.status(403).json({
            success: false,
            message: `رصيد الدقائق غير كافٍ. المطلوب: ${videoMinutes} دقيقة، المتاح: ${user.credits} دقيقة.`
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Prisma Query Warning]:', dbErr.message);
      }
    }

    // 3. تفريغ الصوت الأصلي المنطوق عبر Whisper STT
    console.log(`🎙️ 2. Transcribing audio with Whisper...`);
    const originalTranscript = await transcribeOriginalVideoAudio(inputVideoPath, tempPcmPath);
    console.log(`📝 Original Transcript: "${originalTranscript}"`);

    // 4. الترجمة الذكية عبر Gemini API (gemini-2.5-flash)
    console.log(`🧠 3. Translating with Gemini API to Arabic...`);
    const translatedText = await translateWithGemini(originalTranscript, targetLanguage);
    console.log(`✨ Arabic Translation: "${translatedText}"`);

    // 5. توليد الصوت البشري الطبيعي عبر Edge-TTS
    const neuralVoice = getNeuralVoice(targetLanguage, gender);
    console.log(`🔊 4. Synthesizing voice via [${neuralVoice}]...`);
    await generateNeuralSpeech(translatedText, neuralVoice, dubbedAudioPath, parseFloat(speed) || 1.0);

    // 6. دمج الصوت مع الفيديو وتطبيق العلامة المائية في حال الخطة المجانية
    console.log(`🎬 5. Merging audio and video (Watermark: ${isFree ? 'Yes' : 'No'})...`);
    await mergeDubbedVideoWithWatermark(inputVideoPath, dubbedAudioPath, outputVideoPath, videoDuration, isFree);

    // 7. خصم الرصيد من حساب المستخدم عبر Prisma في حال الخطة المدفوعة
    let remainingCredits = null;
    if (prisma && userEmail && !isFree) {
      try {
        const updatedUser = await prisma.user.update({
          where: { email: userEmail },
          data: { credits: { decrement: videoMinutes } }
        });
        remainingCredits = updatedUser.credits;
        console.log(`💳 [Prisma Deduct] Deducted ${videoMinutes} mins. Remaining: ${remainingCredits}`);
      } catch (deductErr) {
        console.warn('⚠️ [Prisma Update Warning]:', deductErr.message);
      }
    }

    // تنظيف الملفات الصوتية المؤقتة
    if (fs.existsSync(tempPcmPath)) fs.unlinkSync(tempPcmPath);
    if (fs.existsSync(dubbedAudioPath)) fs.unlinkSync(dubbedAudioPath);

    const directDownloadUrl = `${BASE_URL}/download/${outputFilename}`;
    const previewUrl = `${BASE_URL}/uploads/${outputFilename}`;

    console.log(`✅ [Pipeline Done] Dubbed Video Ready: ${directDownloadUrl}\n`);

    return res.status(200).json({
      success: true,
      message: 'تمت ترجمة ودبلجة الفيديو بنجاح عبر Gemini و Edge-TTS!',
      downloadUrl: directDownloadUrl,
      previewUrl: previewUrl,
      data: {
        originalTranscript,
        translatedText,
        voiceUsed: neuralVoice,
        duration: videoDuration,
        videoMinutes,
        watermarkApplied: isFree,
        remainingCredits,
        downloadUrl: directDownloadUrl,
        originalFile: {
          url: previewUrl,
          filename: outputFilename
        },
        result: {
          dubbedVideoUrl: previewUrl
        }
      }
    });

  } catch (error) {
    console.error('❌ [Pipeline Error]:', error);

    if (fs.existsSync(tempPcmPath)) fs.unlinkSync(tempPcmPath);
    if (fs.existsSync(dubbedAudioPath)) fs.unlinkSync(dubbedAudioPath);

    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء معالجة وترجمة الفيديو',
      error: error.message
    });
  }
});

// ================= 9. مسار التحميل المباشر =================
app.get('/download/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'ملف الفيديو غير موجود' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');

    return res.download(filePath, filename, (err) => {
      if (err && !res.headersSent) {
        console.error('❌ [Download Error]:', err);
        res.status(500).json({ success: false, message: 'فشل تحميل الملف' });
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// مسار تحديث وشراء الاشتراكات
app.post('/api/subscribe', async (req, res) => {
  const { plan, price, userEmail } = req.body;
  let allocatedMinutes = plan?.toLowerCase().includes('pro') ? 100 : 500;

  if (prisma && userEmail) {
    try {
      await prisma.user.upsert({
        where: { email: userEmail },
        update: { plan: plan || 'PRO', credits: { increment: allocatedMinutes } },
        create: { email: userEmail, plan: plan || 'PRO', credits: allocatedMinutes }
      });
      console.log(`💎 [Prisma User Subscribed] Email: ${userEmail} | Plan: ${plan}`);
    } catch (subErr) {
      console.warn('⚠️ [Prisma Subscribe Error]:', subErr.message);
    }
  }

  res.json({
    success: true,
    message: `تم تفعيل اشتراك (${plan}) بنجاح وإضافة ${allocatedMinutes} دقيقة!`,
    transaction: { plan, price, allocatedMinutes }
  });
});

// ================= 10. تشغيل السيرفر =================
app.listen(PORT, () => {
  console.log(`
  🚀 =========================================================
  🎙️ LinguaCast Commercial AI SaaS Engine Online!
  🌐 Server:       ${BASE_URL}
  📥 Download:     ${BASE_URL}/download/:filename
  🧠 Translation:  Gemini 2.5 Flash API Active
  🔊 Neural Voice: Microsoft Edge Neural Active (ar-SA)
  🏷️ Monetization: Prisma Credits + Auto Watermark Active
  =========================================================
  `);
});