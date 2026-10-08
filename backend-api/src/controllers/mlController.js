const mlService = require("../services/mlService");
const fs = require("fs");
const path = require("path");

exports.transcribeAudio = async (req, res) => {
  try {
    let videoPath = req.body.videoPath || req.body.filePath;

    if (req.files && req.files.length > 0) {
      videoPath = req.files[0].path;
    }

    const targetLang = req.body.targetLang || req.body.lang || "ar";

    if (!videoPath) {
      return res.status(400).json({ error: "مسار الفيديو مطلوب أو ارفع ملف (video)" });
    }

    // استخراج اسم الملف فقط والتأكد من وجوده في فولدر storage
    let filename = path.basename(videoPath);
    const storageDir = path.join(__dirname, "../../storage");
    const fullPath = path.join(storageDir, filename);

    // لو الملف مش موجود بـ الـ extension، ندور عليه ونضيف له .mp4
    if (!fs.existsSync(fullPath)) {
      if (fs.existsSync(fullPath + ".mp4")) {
        filename += ".mp4";
      } else {
        // لو ملوش امتداد نهائي، نضيف .mp4 افتراضياً ونشوف
        const altPath = fullPath + ".mp4";
        if (!fs.existsSync(altPath)) {
          // نعيد تسمية الملف الفعلي في الهارد لـ .mp4 عشان الـ python يلاقيه فوراً
          try {
            if (fs.existsSync(fullPath)) {
              fs.renameSync(fullPath, altPath);
              filename += ".mp4";
            }
          } catch (e) {
            console.log("Renaming error:", e);
          }
        } else {
          filename += ".mp4";
        }
      }
    }

    const result = await mlService.dubVideo(filename, targetLang);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.speakText = async (req, res) => {
  try {
    const text = req.body.text || req.query.text;
    const lang = req.body.lang || req.query.lang || "ar";

    if (!text) {
      return res.status(400).json({ error: "النص مطلوب (text)" });
    }

    const audioStream = await mlService.streamTTS(text, lang);
    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
