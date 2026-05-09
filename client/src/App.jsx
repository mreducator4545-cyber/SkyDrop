import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Grab the first file
  };

  const uploadFile = async () => {
    if (!file) {
      setStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('SkyDropping...');
      // Added /upload to the end of your Vercel URL
      const response = await fetch('https://vercel.app', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // Points to your download route
      const downloadUrl = `https://vercel.app{data.file}`;
      
      setStatus(
        <div className="bg-sky-500/20 p-3 rounded-lg border border-sky-500/50">
          <p className="text-sky-400 font-bold mb-1">✅ SkyDrop Ready!</p>
          <a 
            href={downloadUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline hover:text-sky-300 transition-colors"
          >
            Download File
          </a>
        </div>
      );
    } catch (error) {
      setStatus('❌ Drop failed. Ensure server is running.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 border border-slate-700 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          SkyDrop
        </h1>
        <p className="text-slate-400 mb-8 text-sm uppercase tracking-widest font-semibold">Fast Global Sharing</p>

        <div className="group relative border-2 border-dashed border-slate-600 rounded-2xl p-8 transition-colors hover:border-sky-500 bg-slate-900/50">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2 pointer-events-none">
            <div className="text-4xl">☁️</div>
            <p className="text-sm font-medium text-slate-300">
              {file ? file.name : "Drop a file to SkyDrop"}
            </p>
          </div>
        </div>

        <button 
          onClick={uploadFile}
          className="mt-8 w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
        >
          SkyDrop It
        </button>

        {status && <div className="mt-6 text-sm">{status}</div>}
      </div>
    </div>
  );
}

export default App;

