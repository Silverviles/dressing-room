import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./common/Header";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import PrivateRoute from "./common/PrivateRoute";
import DashBoard from "./pages/DashBoard.tsx";
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
            <Route path="/dress" element={<DressRoom/>}/>
        </Route>
      </Routes>
        <Footer/>
    </BrowserRouter>
  );
}
