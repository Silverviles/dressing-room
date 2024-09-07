import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
