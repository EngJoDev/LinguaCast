import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import Groq from 'groq-sdk';

const groq = new Groq({ 
  apiKey: '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',
  timeout: 60 * 1000,
  maxRetries: 3
});

const execPromise = util.promisify(exec);
const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

async function translateToEgyptianFallback(text: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    let translated = data[0].map((item: any) => item[0]).join(' ');

    return translated
      .replace(/لا أستطيع أن أصدق/g, 'مش مصدق')
      .replace(/التقينا أخيرًا/g, 'اتقابلنا أخيرًا')
      .replace(/قمة الحركة/g, 'قمة الجبل')
      .replace(/أدناه/g, 'تحت')
      .replace(/لكنك جعلتني أمضي قدمًا/g, 'بس أنت خليتني أكمل')
      .replace(/عدم السماح لي بالاستسلام/g, 'إنك مخلتنيش أستسلم');
  } catch {
    return text;
  }
}

router.get('/download/:filename', (req: Request, res: Response) => {
  const fileName = req.params.filename;
  const filePath = path.join(uploadDir, fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath, fileName);
  } else {
    res.status(404).json({ success: false, message: 'الملف غير موجود' });
  }
});

router.post('/dubbing/start', upload.single('video'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'لم يتم رفع أي فيديو!' });
      return;
    }

    const { targetLang = 'ar-EG', gender = 'male' } = req.body;
    console.log(`🚀 بدء معالجة الفيديو: ${req.file.filename}`);

    const inputVideoPath = req.file.path;
    const timestamp = Date.now();
    const extractedAudioPath = path.join(uploadDir, `extracted-${timestamp}.mp3`);
    const outputDubbedVideoName = `dubbed-${timestamp}.mp4`;
    const outputDubbedVideoPath = path.join(uploadDir, outputDubbedVideoName);
    const audioFolder = path.join(uploadDir, `tts-${timestamp}`);

    if (!fs.existsSync(audioFolder)) {
      fs.mkdirSync(audioFolder, { recursive: true });
    }

    console.log('🎵 جاري استخراج الصوت من الفيديو...');
    await execPromise(`ffmpeg -y -i "${inputVideoPath}" -vn -ar 16000 -ac 1 -b:a 128k "${extractedAudioPath}"`);

    console.log('🎙️ جاري تحويل الصوت إلى نص...');
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(extractedAudioPath),
      model: 'whisper-large-v3',
      prompt: 'A conversation on top of a mountain or forest during hiking.',
      language: 'en',
      response_format: 'text',
    });

    let originalText = typeof transcription === 'string' ? transcription : (transcription as any).text;
    originalText = originalText.replace(/top of motion/gi, 'top of the mountain');
    console.log('📝 النص بعد التصحيح:', originalText);

    console.log('🌐 جاري الترجمة للعامية المصرية...');
    let textToSpeak = '';

    try {
      const translationCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Translate English speech to natural, spoken Egyptian Arabic dialect (عامية مصري عامية سينمائية). Do NOT use formal modern standard arabic (فصحى). Keep it short and natural for video dubbing.',
          },
          { role: 'user', content: originalText },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.3,
      });
      textToSpeak = translationCompletion.choices[0]?.message?.content || '';
    } catch (err) {
      console.log('⚠️ استخدام الترجمة البديلة المكيّفة للعامية...');
      textToSpeak = await translateToEgyptianFallback(originalText);
    }

    console.log('💬 النص المترجم للعامية:', textToSpeak);

    const voiceName = gender === 'female' ? 'ar-EG-SalmaNeural' : 'ar-EG-ShakirNeural';
    console.log(`🔊 جاري تحويل النص لصوت (${voiceName})...`);

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    await tts.toFile(audioFolder, textToSpeak);

    const generatedAudioPath = path.join(audioFolder, 'audio.mp3');

    console.log('🎬 جاري دمج الصوت والصورة بدون فقدان الفيديو...');
    const ffmpegCmd = `ffmpeg -y -i "${inputVideoPath}" -i "${generatedAudioPath}" -c:v libx264 -preset ultrafast -crf 22 -c:a aac -map 0:v:0 -map 1:a:0 -shortest "${outputDubbedVideoPath}"`;
    await execPromise(ffmpegCmd);

    if (fs.existsSync(extractedAudioPath)) fs.unlinkSync(extractedAudioPath);

    const downloadUrl = `http://localhost:5000/api/videos/download/${outputDubbedVideoName}`;
    const videoPreviewUrl = `http://localhost:5000/uploads/${outputDubbedVideoName}`;

    res.json({
      success: true,
      data: {
        dubbedVideoUrl: videoPreviewUrl,
        downloadUrl: downloadUrl,
      },
    });
  } catch (error: any) {
    console.error('❌ خطأ أثناء معالجة الفيديو:', error);
    res.status(500).json({ success: false, error: error?.message || error });
  }
});

export default router;