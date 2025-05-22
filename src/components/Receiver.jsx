
import React, { useState, useEffect, useRef } from "react";


const Receiver = () => {
  const [downloadLink, setDownloadLink] = useState(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isError , setIsError] = useState(false);
  
  const [magnetURI, setMagnetURI] = useState("");
  const[processStart , setProcessStart] = useState(false);
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
    setProcessStart(true);
    setIsError(false);
    try{
      const torrent = clientRef.current.add(magnetURI);
      const timeout = setTimeout(() => {
         if (torrent.numPeers === 0) {
    console.warn("No peers found. This magnet link might be inactive.");
  
      console.warn("Timeout: Magnet link may be inactive or has no seeders.");
      torrent.destroy();
      setIsError(true);
      setProcessStart(false);
         }
      }, 10000);

      torrent.on("download",()=>{
        const percent = Math.round(torrent.progress * 100);
        setProgress(percent);
      })

      torrent.on("error", (err) => {
        console.error("Torrent error:", err.message || err);
        setIsError(true);
        setProcessStart(false);
      });
      torrent.on("ready",()=>{
      torrent.files.forEach((file) => {
        file.getBlobURL((err, url) => {
          if (err) {
            console.error(err);
            setProcessStart(false);
            setIsError(true);
            return;}
          setDownloadLink(url);
          setFileName(file.name);
          setProcessStart(false);
          
        });
      });
      })
    
    }
    catch (error) {
    console.error("Client add error:", error);
    setIsError(true);
    setProcessStart(false);
    }
};

  return (
    <div className="mb-6 flex flex-col items-center">
    <div className=" w-[80vw] lg:w-[50vw]  p-5 mt-5 mb-2 border-1 bg-gray-800 flex flex-col items-center rounded-lg">
      <h2 className="text-xl text-white font-semibold">Receive File</h2>
      <div className="flex items-center flex-col md:flex-col lg:flex-row ">
      <input
        type="text"
        placeholder="Paste magnet URI here"
        value={magnetURI}
        onChange={(e) => setMagnetURI(e.target.value)}
        className=" w-[60vw] lg:w-[30vw] mt-4 text-white p-4 border border-gray-300 rounded mb-2"
      />
      <button
        onClick={async () => {
         const text = await navigator.clipboard.readText();
        setMagnetURI(text);
        
       }}
      className="bg-blue-600 text-white px-6 py-4 rounded hover:bg-blue-700 m-2 mt-4">Paste</button>
      </div>
      
      <div>
        
      <button
        onClick={handleDownload}
        className="bg-gradient-to-r px-6 py-3 from-blue-600 to-purple-600 text-white rounded-lg m-2  mt-5  hover:from-blue-800 hover:to-purple-800"
      >
        Download
      </button>
      </div>
      { isError && (
          <div> 
          <p className="text-red-600">invalid or expired link / unexpected error</p>
          </div>
        )}
      {/* Progress bar */}
      { !isError && processStart && progress >= 0 && progress < 100 && (
        <div className="w-[45vw] mt-4 bg-gray-300 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {processStart && progress >=0 && progress < 100 && (
        <p className="text-white mt-1">{progress}% received</p>
      )}

      {/* Completed message */}
      {progress === 100 && (
        <p className="text-green-400 mt-2">File received!</p>
      )}

      {downloadLink && (
        <div className="mt-4 flex flex-col items-center">
          <a
            href={downloadLink}
            download={fileName}
            className="text-blue-700 underline text-center"
          >
              {fileName}
             <br></br>
             <button className="m-2 border border-gray-400 bg-black text-gray-300 px-6 py-2 rounded-lg font-semibold hover:bg-gray-800"><span>Save</span> </button>
          </a>
        </div>
      )}
      </div>
    </div>
  );
};

export default Receiver;
