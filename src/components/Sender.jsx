import React, { useEffect, useRef, useState } from "react";

const Sender = () => {
  const [magnetURI, setMagnetURI] = useState("");
  const [fileName, setFilename] = useState("");
  const clientRef = useRef(null);
  const [isUpload, setIsUpload] = useState(false);
  const [storageWarning , setStorageWarning] = useState("");
  const [activeTorrent , setActiveTorrent] = useState(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new window.WebTorrent();
    }
  }, []);

  const checkStorage = async (file)=>{
    if('storage' in navigator && 'estimate' in navigator.storage){
      const {quota, usage} = await navigator.storage.estimate();
      const available = quota - usage;

      if(file.size > available * 0.9){
        setStorageWarning("Warning: File size is close to or exceeds available storage.")
        return false;
      }
      else{
        setStorageWarning(""); 
        return true;
      }
    }

  }

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file){
      setIsUpload(false)
      return;
    } 
    
    const canSeed = await checkStorage(file);
      if(!canSeed){
        setIsUpload(false);
        return;
      } 
    

    setMagnetURI("");

    clientRef.current.seed(file, (torrent) => {
      setActiveTorrent(torrent);
      setFilename(file.name);
      console.log("Seeding:", torrent.magnetURI);

      torrent.on("wire", (wire, addr) => {
        console.log("Peer connected:", addr || wire.remoteAddress);
      });
      setMagnetURI(torrent.magnetURI);

      setTimeout(() => {
        setIsUpload(false);
      }, 500);
    });
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(magnetURI);
  };
  const handleClear = () => {
    try{
    if(activeTorrent && clientRef.current){
        clientRef.current.remove(activeTorrent , ()=>{
          console.log("torrent remove from client")
        })
      }}catch(err){
          console.error("error removing torrent" , err)
      
      }
     setActiveTorrent(null);
  setMagnetURI("");
  setFilename("");
  setIsUpload(false);
  setStorageWarning("");
   if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto flex flex-col items-center px-4">
      <div className="max-w-[80vw] p-5 mx-10 mt-5 mb-2 border-1 bg-gray-800 flex flex-col items-center rounded-lg ">
        <h2 className="text-xl text-center text-white font-semibold">
          Send File
        </h2>
        <div
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleFileUpload}
          className="max-w-[70vw] flex flex-col py-4 px-20 m-5 border-2 border-dashed border-gray-400 rounded-lg items-center hover:border-gray-200"
        >
          <div className="flex flex-col items-center my-5">
            <p className="text-gray-400 ">Drag and drop file here</p>
            {
              // <input type="file" onChange={handleFileUpload} className="my-2 text-white mt-10 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
            }
            <input
              type="file"
              className="hidden "
              ref={fileInputRef}
              id="fileInput"
              aria-label="File Upload"
              onChange={(e) => {
                setIsUpload(true);
                handleFileUpload(e);
              }}
            />
            <div className="px-5 py-2 m-3 border-2 rounded-lg bg-black flex items-center hover:bg-gray-800">
              <label
                htmlFor="fileInput"
                className="text-gray-200 text-center font-bold"
              >
                Choose file
              </label>
            </div>
            <p className="text-gray-400">
              {fileName ? `Selected file: ${fileName}` : "No file selected"}
            </p>
          </div>
        </div>
      </div>

      { !isUpload && storageWarning && (
        <p className="text-red-500 font-semibold mt-4">{storageWarning}</p>
      )}
      
      {isUpload && (
        <div>
          <p className="text-green-400">File is Processing... </p>
        </div>
      )}

      {!isUpload && magnetURI && (
        <>
          <p className="mt-2 text-white font-semibold">
            Share this magnet link:
          </p>
          <textarea
            readOnly
            value={magnetURI}
            className="w-full max-w-[80vw] text-white mt-6 px-4 py-2 border border-gray-300 rounded break-words"
            rows={3}
          ></textarea>

          <div className="flex gap-4">
            <button
              onClick={handleCopy}
              className="px-6 py-2 font-bold-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md   mt-5  hover:from-blue-800 hover:to-purple-800"
            >
              copy
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 font-bold-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md  mt-5  hover:from-blue-800 hover:to-purple-800"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sender;
