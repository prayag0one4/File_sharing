import React, { useEffect, useRef } from "react";

const Sender = ({ magnetURI, setMagnetURI }) => {
  const clientRef = useRef(null);
  
  

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new window.WebTorrent();
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMagnetURI("");

    clientRef.current.seed(file, (torrent) => {
    console.log("Seeding:", torrent.magnetURI);

    torrent.on("wire", (wire, addr) => {
    console.log("Peer connected:", addr || wire.remoteAddress);
    });

    setMagnetURI(torrent.magnetURI);


    
    });
  }
  const handleCopy = async()=>{
    await navigator.clipboard.writeText(magnetURI)
    alert("link copy to clipboard")
  }
  const handleClear = ()=>{
    setMagnetURI("");
  }
  return (
    <div className="mb-6 flex flex-col items-center">
      <h2 className="text-xl text-center text-white font-semibold">Send File</h2>
      <input type="file" onChange={handleFileUpload} className="my-2 text-white mt-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
      
      
      
      { magnetURI && (
        <>
          <p className="mt-2 text-white font-bold-200">Share this magnet link:</p>
          <textarea
            readOnly
            value={magnetURI}
            className="w-[80vw] text-white mx-10 mt-6 px-10 p-2 border border-gray-300 rounded"
            rows={3}
          ></textarea>

          <div className="">
          <button onClick={handleCopy} className="px-6 py-2 font-bold-200 text-white border-1 bg-blue-700 rounded-md m-2  mt-5">copy</button>
          <button onClick={handleClear} className="px-6 py-2 font-bold-200 text-white border-1 bg-blue-700 rounded-md m-2 mt-5">Clear</button>
          </div>
          
        </>
      )}
    </div>
  );
};

export default Sender;
