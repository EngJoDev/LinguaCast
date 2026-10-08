import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'لم يتم إرفاق أي ملف فيديو!' 
      });
    }

    const { targetLang } = req.body;
    const inputPath = req.file.path;
    const outputFileName = `dubbed-${req.file.filename}`;
    const outputPath = path.join(req.file.destination, outputFileName);

    // مسارات السكربت والبيئة الافتراضية venv
    const pythonScript = path.join(__dirname, '../scripts/process_video.py');
    const pythonExecutable = path.join(process.cwd(), 'venv/bin/python3');

    console.log('🎬 [LinguaCast] بدء معالجة الفيديو بواسطة AI Engine...');

    // تشغيل السكربت باستخدام python3 الخاص بـ venv
    const pythonProcess = spawn(pythonExecutable, [pythonScript, inputPath, targetLang || 'ar', outputPath]);

    // طباعة مخرجات السكربت في ترمينال الباك إند لمتابعة التنفيذ
    pythonProcess.stdout.on('data', (data) => {
      console.log(`🐍 [Python Log]: ${data.toString().trim()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`⚠️ [Python Warning]: ${data.toString().trim()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ [LinguaCast] تمت معالجة الفيديو بنجاح!');
        return res.status(200).json({
          success: true,
          message: 'تمت المعالجة والدبلجة بنجاح!',
          data: {
            dubbedVideoUrl: `http://localhost:5000/uploads/${outputFileName}`,
            downloadUrl: `http://localhost:5000/uploads/${outputFileName}`
          }
        });
      } else {
        console.error(`❌ [LinguaCast] فشل السكربت بكود خروج: ${code}`);
        return res.status(500).json({ 
          success: false, 
          message: 'حدث خطأ أثناء دبلجة الفيديو.' 
        });
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'خطأ غير متوقع في السيرفر' 
    });
  }
};
