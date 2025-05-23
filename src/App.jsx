import './index.css';
import { Header } from "./components/Header";
import { TabNavigation } from "./components/TabNavigation";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-[100vh] bg-gray-900 text-white">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <TabNavigation />
      </main>

      <Footer />
    </div>
  );
}

