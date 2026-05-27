import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";
import PrivateRoute from "./common/PrivateRoute";
import AdminRoute from "./common/AdminRoute";
import Home from "./pages/Home";
import {Footer} from "./common/Footer.tsx";

const DashBoard = lazy(() => import("./pages/DashBoard.tsx"));
const SkinColor = lazy(() => import("./pages/SkinColor.tsx"));
const Presets = lazy(() => import("./pages/Presets.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const DressRoom = lazy(() =>
  import("./pages/tabs/DressRoom.tsx").then((module) => ({
    default: module.DressRoom,
  }))
);
const ClothMenu = lazy(() => import("./pages/tabs/ClothMenu.tsx"));

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute/>}>
            <Route path="/my-clothes" element={<DashBoard/>} />
            <Route path="/dashboard" element={<DashBoard/>} />
            <Route path="/skin-color" element={<SkinColor/>} />
            <Route path="/presets" element={<Presets/>} />
            <Route path="/dress" element={<DressRoom/>}/>
            <Route path="/favorites" element={<Favorites/>}/>
          </Route>
          <Route element={<AdminRoute/>}>
            <Route path="/cloth" element={<ClothMenu/>}/>
          </Route>
        </Routes>
      </Suspense>
      <Footer/>
    </BrowserRouter>
  );
}
