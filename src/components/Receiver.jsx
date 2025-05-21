
import React, { useState, useEffect, useRef } from "react";


const Receiver = ({ magnetURI, setMagnetURI }) => {
  const [downloadLink, setDownloadLink] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new window.WebTorrent();
    }
  }, []);

  const handleDownload = () => {
    
    if (!magnetURI){
      return;
    } 
    setDownloadLink("");
    setFileName("");
    setProgress(0);

    clientRef.current.add(magnetURI, (torrent) => {

      torrent.on("download",()=>{
        const percent = Math.round(torrent.progress * 100);
        setProgress(percent);
      })




      torrent.files.forEach((file) => {
        file.getBlobURL((err, url) => {
          if (err) {
            console.error(err);
            return;}
          setDownloadLink(url);
          setFileName(file.name);
          
        });
      });
    });
  
};

  return (
    <div className="mb-6 flex flex-col items-center">
      <h2 className="text-xl text-white font-semibold">Receive File</h2>
      <input
        type="text"
        placeholder="Paste magnet URI here"
        value={magnetURI}
        onChange={(e) => setMagnetURI(e.target.value)}
        className="w-[80vw] mt-4 text-white p-4 border border-gray-300 rounded mb-2"
      />
      <div>
        <button
        onClick={async () => {
         const text = await navigator.clipboard.readText();
        setMagnetURI(text);
        
       }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 m-2">Paste</button>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 m-2"
      >
        Download
      </button>
      </div>
      {/* Progress bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-[80vw] mt-4 bg-gray-300 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {progress > 0 && progress < 100 && (
        <p className="text-white mt-1">{progress}% received</p>
      )}

      {/* Completed message */}
      {progress === 100 && (
        <p className="text-green-400 mt-2">File received!</p>
      )}

      {downloadLink && (
        <div className="mt-4">
          <a
            href={downloadLink}
            download={fileName}
            className="text-blue-700 underline"
          >
             Download {fileName}
          </a>
        </div>
      )}
    </div>
  );
};

export default Receiver;
