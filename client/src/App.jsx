import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  // Update this to your ACTUAL server URL from your Vercel Dashboard
  const SERVER_URL = 'https://sky-drop-liart.vercel.app';

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus(''); // Clear status when new file selected
    }
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
      
      const response = await fetch(`${SERVER_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const data = await response.json();
      const downloadUrl = `${SERVER_URL}/download/${data.file}`;
      
      setStatus(
        <div className="bg-sky-500/20 p-4 rounded-lg border border-sky-500/50 mt-4 animate-in fade-in duration-300">
          <p className="text-sky-400 font-bold mb-2">✅ SkyDrop Ready!</p>
          <a 
            href={downloadUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md font-semibold transition-colors shadow-sm"
          >
            Download File
          </a>
        </div>
      );
    } catch (error) {
      console.error('Upload Error:', error);
      setStatus(`❌ Drop failed: ${error.message || 'Check if server is running'}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="bg-slate-800 border border-slate-700 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent italic">
          SkyDrop
        </h1>
        <p className="text-slate-400 mb-8 text-xs uppercase tracking-[0.2em] font-bold">Fast Global Sharing</p>

        <div className="group relative border-2 border-dashed border-slate-600 rounded-2xl p-10 transition-all hover:border-sky-500 bg-slate-900/40 hover:bg-slate-900/60 cursor-pointer">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="text-5xl transition-transform group-hover:scale-110 duration-300">☁️</div>
            <p className="text-sm font-medium text-slate-300">
              {file ? (
                <span className="text-sky-400 font-bold truncate block px-2">{file.name}</span>
              ) : (
                "Drop a file to SkyDrop"
              )}
            </p>
          </div>
        </div>

        <button 
          onClick={uploadFile}
          className="mt-8 w-full py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(2,132,199,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!file || status === 'SkyDropping...'}
        >
          {status === 'SkyDropping...' ? 'Processing...' : 'SkyDrop It'}
        </button>

        {status && <div className="mt-2">{typeof status === 'string' ? <p className="text-sm font-medium pt-4">{status}</p> : status}</div>}
      </div>
    </div>
  );
}

export default App;
