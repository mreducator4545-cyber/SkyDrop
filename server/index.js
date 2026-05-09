const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os'); // Needed for temp directory

const app = express();
app.use(cors());
app.use(express.json());

// Vercel uses a read-only filesystem. Use the system temp folder for uploads.
const uploadDir = os.tmpdir(); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Health check route for the home page
app.get('/', (req, res) => {
  res.send('SkyDrop Server is running!');
});

// Route to handle upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ 
    message: 'File uploaded successfully!', 
    file: req.file.filename 
  });
});

// Route to handle downloads from the temp folder
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found or expired.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


