import { BrowserRouter, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import Header from "./common/Header";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}
