import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";
import Home from "./pages/Home";
import PrivateRoute from "./common/PrivateRoute";
import DashBoard from "./pages/DashBoard.tsx";
import DressRoom from "./pages/DressRoom.tsx";
import Compare from "./pages/Compare.tsx";
import Chatbot from "./components/Chatbot.tsx";
import DressRoomtemp from "./pages/DressRoomtemp.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/compare" element={<Compare/>} />
        <Route path="/chatbot" element={<Chatbot/>} />
        <Route element={<PrivateRoute/>}>
            {/*Add private Routes here*/}
            <Route path="/my-clothes" element={<DashBoard/>} />
            <Route path="/dashboard" element={<DashBoard/>} />
            <Route path="/dress" element={<DressRoomtemp/>}/> /*temporary*/
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
