import { useEffect, useState } from "react";
import NavigationBar from "../common/NavigationBar";
import SideBar from "../common/SideBar";
import Home from "./Home";
import Cloths from "./Cloths";
import { useLocation } from "react-router-dom";

export default function DashBoard() {
  const [tab, setTab] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const urlPatams = new URLSearchParams(location.search);
    const tabFromURL = urlPatams.get("tab");

    if (location.pathname === "/" && !tabFromURL) {
      setTab(""); //reset tab to default
    } else if (tabFromURL) {
      setTab(tabFromURL);
    }

    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search, location.pathname]);
  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/6 h-full">
        <SideBar />
      </div>
      <div className="h-full w-5/6 overflow-y-auto">
        <NavigationBar />
        <div>
          <div className="mx-2">
            {tab === "" && <Home />}
            {tab === "cloth" && <Cloths />}
          </div>
        </div>
      </div>
    </div>
  );
}
