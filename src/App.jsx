import React, { useState } from "react";
import Sender from "./components/Sender";
import Receiver from "./components/Receiver";
import './index.css';
import { Header } from "./components/Header";
import { TabNavigation } from "./components/TabNavigation";
import { Footer } from "./components/footer";

export default function App() {
  


  return (
    <div className="w-full min-h-screen bg-gray-900  pb-20">
    <Header></Header>
    <TabNavigation ></TabNavigation>
    <Footer></Footer>
      
    </div>
  );
}
