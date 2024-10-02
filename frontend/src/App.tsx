import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";
import Compare from "./pages/Compare";
import Chatbot from "./components/Chatbot";
import Home from "./pages/Home";
import PrivateRoute from "./common/PrivateRoute";
import DashBoard from "./pages/DashBoard.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/compare" element={<Compare/>} />
        <Route path="/chatbot" element={<Chatbot/>} />
        <Route element={<PrivateRoute/>}>
            {/*Add private Routes here*/}
            <Route path="/my-clothes" element={<DashBoard/>} />
            <Route path="/dashboard" element={<DashBoard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
