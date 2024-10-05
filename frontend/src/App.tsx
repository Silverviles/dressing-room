import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import PrivateRoute from "./common/PrivateRoute";
import DashBoard from "./pages/DashBoard.tsx";
import SkinColor from "./pages/SkinColor.tsx";
import Presets from "./pages/Presets.tsx";
import DressRoom from "./pages/DressRoom.tsx";
import Home from "./pages/Home";
import {Footer} from "./common/Footer.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute/>}>
            {/*Add private Routes here*/}
            <Route path="/my-clothes" element={<DashBoard/>} />
            <Route path="/dashboard" element={<DashBoard/>} />
            <Route path="/skin-color" element={<SkinColor/>} />
            <Route path="/presets" element={<Presets/>} />
            <Route path="/dress" element={<DressRoom/>}/>
        </Route>
      </Routes>
        <Footer/>
    </BrowserRouter>
  );
}
