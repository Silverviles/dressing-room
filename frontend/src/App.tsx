import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Header from "./common/Header";
import Compare from "./pages/Compare";
import Chatbot from "./components/Chatbot";

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/compare" element={<Compare/>} />
        <Route path="/chatbot" element={<Chatbot/>} />
      </Routes>
    </BrowserRouter>
  );
}
