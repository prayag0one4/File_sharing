import { useState } from "react"
import Sender from "./Sender";
import Receiver from "./Receiver";

export const TabNavigation =()=>{
    const [activeTab, setActivetab] = useState("send");

    return(
        <div className="flex flex-col items-center justify-center my-6 w-full flex-1">
            <div className=" rounded-lg flex gap-4 border-1 p-1 border-gray-500" role="group">
                <button type ="button" onClick={()=>setActivetab('send')} 
                className={`px-8 py-3 text-sm font-medium rounded-lg ${
                    activeTab ==="send"? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white':'bg-gray-900 text-gray-500 border-0 hover:text-gray-200 '}`}
                ><div className="flex flex-col items-center justify-center gap-2">
                    
                    <span>Send</span>
                     
                </div></button>


                <button type="button" onClick={()=>setActivetab('receive')} 
                className={`px-6 py-3 text-sm font-medium rounded-lg ${
                    activeTab ==="receive"? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white':'bg-gray-900 text-gray-500 border-0 hover:text-gray-200 '}`}
                ><div className="flex items-center justify-center gap-2">
                    
                    <span>Receieve</span>
                    
                </div></button>

            </div>
            <div>
                    {activeTab== "receive"?(<Receiver></Receiver>):(<Sender></Sender>)}
            </div>
        </div>
    )
}