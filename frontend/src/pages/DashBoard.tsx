import { useEffect, useState } from "react";
import Home from "./Home";
import {Link, useLocation} from "react-router-dom";

import ClothMenu from "./tabs/ClothMenu.tsx";
import {List, ListItem, ListItemPrefix, Typography} from "@material-tailwind/react";
import {COLORS} from "../utils/constants/colors.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faHome, faShirt, faTShirt} from "@fortawesome/free-solid-svg-icons";
import {DressRoom} from "./tabs/DressRoom.tsx";

export default function DashBoard() {
  const [tab, setTab] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");

    if (location.pathname === "/" && !tabFromURL) {
      setTab(""); //reset tab to default
    } else if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search, location.pathname]);
  return (
    <div className="flex h-screen w-screen">
      <div className={tab != "dress" ? "w-1/6 h-full" : ""}>
        {tab != "dress" && <SideBar />}
      </div>
      <div className={tab != "dress" ? "h-full w-5/6 overflow-y-auto" : "w-full"}>
        <div>
          <div className="p-4 bg-gray-100">
            {tab === "" && <Home />}
            {tab === "cloth" && <ClothMenu />}
            {tab === "dress" && <DressRoom />}
          </div>
        </div>
      </div>
    </div>
  );
}


const SideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else if (location.pathname === "/dashboard") {
      setTab(""); // Default tab
    }
  }, [location.search, location.pathname]);

  return (
      <div className="w-full h-full" style={{backgroundColor: COLORS.ACCENT_LIGHT}}>
        <div>
          <List {...({} as any)}>
            <Link to="/dashboard">
              <ListItem {...({} as any)} selected={tab === ""}>
                <ListItemPrefix> <FontAwesomeIcon color={"white"} icon={faHome}/></ListItemPrefix>
                <Typography className="text-sm" color="white" {...({} as any)}>
                  Home Menu
                </Typography>
              </ListItem>
            </Link>
            <Link to="/dashboard?tab=cloth">
              <ListItem {...({} as any)} selected={tab === "cloth"}>
                <ListItemPrefix> <FontAwesomeIcon color={"white"} icon={faShirt}/></ListItemPrefix>
                <Typography className="text-sm" color="white" {...({} as any)}>
                  Cloth Menu
                </Typography>
              </ListItem>
            </Link>

            {/*Add more here*/}
            <Link to="/dashboard?tab=settings">
              <ListItem {...({} as any)}>
                <ListItemPrefix> <FontAwesomeIcon color={"white"} icon={faCogs}/></ListItemPrefix>
                <Typography className="text-sm" color="white" {...({} as any)}>
                  Settings
                </Typography>
              </ListItem>
            </Link>
            <Link to="/dashboard?tab=dress">
              <ListItem {...({} as any)}>
                <ListItemPrefix> <FontAwesomeIcon color={"white"} icon={faTShirt}/></ListItemPrefix>
                <Typography className="text-sm" color="white" {...({} as any)}>
                  Dress Room
                </Typography>
              </ListItem>
            </Link>

          </List>
        </div>
      </div>
  );
}


