import './index.css';
import { Header } from "./components/Header";
import { TabNavigation } from "./components/TabNavigation";
import { Footer } from "./components/Footer";

export default function App() {
  


  return (
    <div className="w-full min-h-screen bg-gray-900  pb-20">
    <Header></Header>
    <TabNavigation ></TabNavigation>
    <Footer></Footer>
      
    </div>
  );
}
