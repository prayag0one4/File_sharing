import React, { useEffect, useRef, useState } from "react";

const Sender = () => {
  const [magnetURI, setMagnetURI] = useState("");
  const[fileName , setFilename] = useState("");
  const clientRef = useRef(null);
  const[isUpload, setIsUpload] = useState(false);
  
  

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new window.WebTorrent();
    }
  }, []);

  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;
    

    setMagnetURI("");

    clientRef.current.seed(file, (torrent) => {
      setFilename(file.name)
    console.log("Seeding:", torrent.magnetURI);
    

    torrent.on("wire", (wire, addr) => {
    console.log("Peer connected:", addr || wire.remoteAddress);
    });

    setMagnetURI(torrent.magnetURI);
    setTimeout(() => {
    setIsUpload(false);
    }, 500); 

    
    });
  }
  const handleCopy = async()=>{
    await navigator.clipboard.writeText(magnetURI)
    
  }
  const handleClear = ()=>{
    setMagnetURI("");
  }

  return (
    <div className="flex flex-col items-center">
    <div className=" p-5 mx-10 mt-5 mb-2 border-1 bg-gray-800 flex flex-col items-center rounded-lg ">
      <h2 className="text-xl text-center text-white font-semibold">Send File</h2>
      <div 
      onDragOver={(e)=>{e.preventDefault();}}
      onDrop={handleFileUpload}
      className="flex flex-col py-4 px-20 m-5 border-2 border-dashed border-gray-400 rounded-lg items-center hover:border-gray-200">
      <div className="flex flex-col items-center my-5">
      <p className="text-gray-400 ">Drag and drop file here</p>
      {// <input type="file" onChange={handleFileUpload} className="my-2 text-white mt-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
      }
      <input type="file" className="hidden " id="fileInput" onChange={(e)=>{setIsUpload(true);handleFileUpload(e); }} />
      <div className="px-5 py-2 m-3 border-2 rounded-lg bg-black flex items-center hover:bg-gray-800 ">
      <label htmlFor="fileInput" className="text-gray-200 text-center font-bold" >Choose file</label>
      </div>
      <p  className="text-gray-400">{fileName ? `Selected file: ${fileName}` : 'No file selected'}</p>
      </div>

      </div>
      </div>
      {isUpload &&(
        <div>
          <p className="text-green-400">File is Processing... </p>
        </div>
      )}
      
      { magnetURI && (
        <>
          <p className="mt-2 text-white font-bold-200">Share this magnet link:</p>
          <textarea
            readOnly
            value={magnetURI}
            className="w-[80vw] text-white mx-10 mt-6 px-10 p-2 border border-gray-300 rounded"
            rows={3}
          ></textarea>

          <div className="flex gap-4">
          <button onClick={handleCopy} className="px-6 py-2 font-bold-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md   mt-5  hover:from-blue-800 hover:to-purple-800">copy</button>
          <button onClick={handleClear} className="px-6 py-2 font-bold-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md  mt-5  hover:from-blue-800 hover:to-purple-800">Clear</button>
          </div>
          
        </>
      )}
      
    </div>
  );
};

export default Sender;
