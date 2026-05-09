const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Explicitly allow your frontend URL to prevent CORS errors
app.use(cors({
  origin: "https://skydrop-client-hxmy9rn09-mreducator4545-cybers-projects.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Memory storage is required for Vercel Serverless Functions
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 4.5 * 1024 * 1024 } // Vercel free tier limit is 4.5MB
});

// Temporary in-memory cache
const fileCache = {};

app.get('/', (req, res) => {
  res.send('SkyDrop Server is running!');
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  const fileId = Date.now() + '-' + req.file.originalname;
  
  // Save file to RAM
  fileCache[fileId] = {
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    originalname: req.file.originalname
  };

  res.json({ 
    message: 'File uploaded to memory!', 
    file: fileId 
  });
});

app.get('/download/:fileId', (req, res) => {
  const fileData = fileCache[req.params.fileId];
  
  if (fileData) {
    res.setHeader('Content-Type', fileData.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalname}"`);
    res.send(fileData.buffer);
  } else {
    res.status(404).send('File expired or not found. (Vercel memory clears every few minutes)');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

