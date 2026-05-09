const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors()); // Allows your client to talk to this server
app.use(express.json());

// Use Memory Storage instead of Disk Storage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Temporary store to hold files in RAM (cleared when server sleeps)
const fileCache = {};

app.get('/', (req, res) => {
  res.send('SkyDrop Server is running!');
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  
  const fileId = Date.now() + '-' + req.file.originalname;
  
  // Store the file buffer in memory
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
    res.setHeader('Content-Disposition', `attachment; filename=${fileData.originalname}`);
    res.send(fileData.buffer);
  } else {
    res.status(404).send('File expired or not found. Vercel cleared the memory.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
