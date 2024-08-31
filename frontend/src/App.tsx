import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Header from "./common/Header";
import DressRoom from "./pages/DressRoom.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/dress" element={<DressRoom/>}/>
            </Routes>
        </BrowserRouter>
    );
}
