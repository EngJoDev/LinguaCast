const axios = require("axios");
const path = require("path");

const ML_BASE_URL = process.env.ML_BASE_URL || "http://ml-service:8001";

exports.dubVideo = async (videoPath, targetLang) => {
  try {
    const pureFilename = path.basename(videoPath);
    const response = await axios.post(`${ML_BASE_URL}/api/ml/dub`, null, {
      params: {
        video_filename: pureFilename,
        target_lang: targetLang
      }
    });
    return response.data;
  } catch (error) {
    console.error("خطأ في خدمة الذكاء الاصطناعي أثناء الدبلجة:", error.message);
    throw error;
  }
};

exports.streamTTS = async (text, lang) => {
  try {
    const response = await axios.get(`${ML_BASE_URL}/api/ml/tts/stream`, {
      params: { text, lang },
      responseType: "stream"
   });
    return response.data;
  } catch (error) {
    console.error("خطأ في خدمة تحويل النص إلى صوت:", error.message);
    throw error;
  }
};
