import React, { useState } from "react";
import Sender from "./components/Sender";
import Receiver from "./components/Receiver";
import './index.css';

export default function App() {
  const [magnetURI, setMagnetURI] = useState("");
  const [activeTab, setActivetab] = useState("sender");

  return (
    <div className={`w-[100vw] h-[100vh] pb-20 pt-20 mx-auto bg-gray-900`}>
      <h1 className="text-3xl pb-5 font-bold mb-4 text-center text-white">WebTorrent File Sharing</h1>
      <div className="flex justify-center mb-6 space-x-4">
        <button className={`border-1 px-6 py-2 rounded-sm ${
          activeTab == 'sender'? "bg-violet-700 text-white":"bg-gray-100 hover:bg-gray-200"}`} onClick={()=>setActivetab("sender")}>Send</button>
        <button className={`border-1 px-6 py-2 rounded-sm ${
          activeTab == 'receiver'? "bg-violet-700 text-white":"bg-gray-100 hover:bg-gray-200"}`} onClick={()=>setActivetab("receiver")}>Receieve</button>
      </div>
      <div>
      {activeTab==="sender" && (
        <Sender magnetURI={magnetURI} setMagnetURI={setMagnetURI} />
      )}
      {activeTab==="receiver" && (
        <Receiver magnetURI={magnetURI} setMagnetURI={setMagnetURI} />
      )}
      
      </div>
    </div>
  );
}
