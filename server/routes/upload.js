import express from 'express';
import multer from 'multer';
import Video from '../models/Video.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description, sourceLang, targetLangs } = req.body;
    
    const newVideo = new Video({
      user: req.user.id,
      title,
      description,
      filename: req.file.filename,
      sourceLang,
      targetLangs: JSON.parse(targetLangs),
      size: req.file.size
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
