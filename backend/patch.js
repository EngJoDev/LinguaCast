const fs = require('fs');
const path = require('path');

// 1. Update process_video.py
const pyCode = `import sys, os, argparse
from moviepy.editor import VideoFileClip, AudioFileClip

def process_video(input_video_path, input_audio_path, output_path):
    try:
        output_dir = os.path.dirname(output_path)
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        video_clip = VideoFileClip(input_video_path)
        audio_clip = AudioFileClip(input_audio_path)
        final_clip = video_clip.set_audio(audio_clip)
        final_clip.write_videofile(
            output_path, codec="libx264", audio_codec="aac",
            temp_audiofile="temp-audio.m4a", remove_temp=True,
            ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
            verbose=False, logger=None
        )
        video_clip.close(); audio_clip.close(); final_clip.close()
        return True
    except Exception as e:
        sys.exit(1)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--video', required=True)
    parser.add_argument('--audio', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    process_video(args.video, args.audio, args.output)
`;
fs.writeFileSync('process_video.py', pyCode);

// 2. Update server.js
const srvCode = `const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const videoRoutes = require('./routes/videoRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');
[uploadsDir, outputsDir].forEach((dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const staticOptions = {
  etag: true, extensions: ['mp4', 'webm', 'mp3', 'wav'],
  setHeaders: (res) => { res.set('Access-Control-Allow-Origin', '*'); res.set('Accept-Ranges', 'bytes'); }
};
app.use('/outputs', express.static(outputsDir, staticOptions));
app.use('/uploads', express.static(uploadsDir, staticOptions));
app.use('/api/video', videoRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => console.log('🚀 LinguaCast Server running on http://localhost:' + PORT));
`;
fs.writeFileSync('server.js', srvCode);

// 3. Update controllers/videoController.js
const ctrlCode = `const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.processVideo = async (req, res) => {
  try {
    const videoFile = req.files?.video ? req.files.video[0] : null;
    const audioFile = req.files?.audio ? req.files.audio[0] : null;
    if (!videoFile) return res.status(400).json({ error: 'ملف الفيديو مطلوب' });

    const inputVideoPath = videoFile.path;
    const inputAudioPath = audioFile ? audioFile.path : inputVideoPath;
    const outputFileName = \`output_\${Date.now()}_\${path.basename(videoFile.originalname, path.extname(videoFile.originalname))}.mp4\`;
    const outputPath = path.join(__dirname, '..', 'outputs', outputFileName);
    const pythonScriptPath = path.join(__dirname, '..', 'process_video.py');

    const pythonProcess = spawn('python3', [pythonScriptPath, '--video', inputVideoPath, '--audio', inputAudioPath, '--output', outputPath]);

    pythonProcess.on('close', (code) => {
      if (code !== 0) return res.status(500).json({ error: 'فشلت معالجة الفيديو' });
      const baseUrl = \`\${req.protocol}://\${req.get('host')}\`;
      const videoUrl = \`\${baseUrl}/outputs/\${outputFileName}\`;
      return res.status(200).json({ success: true, videoUrl: videoUrl });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
`;
if (!fs.existsSync('controllers')) fs.mkdirSync('controllers');
fs.writeFileSync('controllers/videoController.js', ctrlCode);

// 4. Update frontend/src/App.jsx
const appCode = `import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef(null);

  const handleProcessVideo = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert('يرجى اختيار ملف فيديو أولاً');
    setLoading(true); setErrorMessage(''); setVideoUrl('');

    const formData = new FormData();
    formData.append('video', videoFile);
    if (audioFile) formData.append('audio', audioFile);

    try {
      const response = await axios.post('http://localhost:5000/api/video/process', formData);
      if (response.data?.videoUrl) {
        setVideoUrl(response.data.videoUrl);
      } else {
        throw new Error('لم يتم استلام رابط الفيديو');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'حدث خطأ في المعالجة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial', direction: 'rtl', textAlign: 'center' }}>
      <h1>LinguaCast - دبلجة ومعالجة الفيديو</h1>
      <form onSubmit={handleProcessVideo} style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required />
        <br/><br/>
        <button type="submit" disabled={loading}>{loading ? 'جاري المعالجة...' : 'بدء المعالجة'}</button>
      </form>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {videoUrl && (
        <div>
          <h3>الفيديو الناتج:</h3>
          <video key={videoUrl} ref={videoRef} src={videoUrl} controls playsInline style={{ width: '100%' }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
export default App;
`;
const appPath = path.resolve('../frontend/src/App.jsx');
if (fs.existsSync(path.dirname(appPath))) {
  fs.writeFileSync(appPath, appCode);
  console.log('✅ Updated App.jsx');
}

console.log('🎉 ALL 4 FILES UPDATED SUCCESSFULLY!');
