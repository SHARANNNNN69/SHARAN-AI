import { BrowserRouter, Routes, Route } from "react-router-dom";
import NexusAI from "./NexusAI";
import ChatInterface from "./Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NexusAI />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </BrowserRouter>
  );
}

// Install dependency:
// npm install react-router-dom