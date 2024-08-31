import { List, ListItem, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function SideBar() {
  const location = useLocation();
  const navigate = useLocation();
  const dispatch = useDispatch();
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
    <div className="bg-gray-900 w-full h-full">
      <div>
        <List {...({} as any)}>
          <Link to="/dashboard">
            <ListItem {...({} as any)} selected={tab === ""}>
              <Typography color="white" {...({} as any)}>
                Home Menu
              </Typography>
            </ListItem>
          </Link>
          <Link to="/dashboard?tab=cloth">
            <ListItem {...({} as any)} selected={tab === "cloth"}>
              <Typography color="white" {...({} as any)}>
                Cloth Menu
              </Typography>
            </ListItem>
          </Link>

          <Link to="/dashboard?tab=settings">
            <ListItem {...({} as any)}>
              <Typography color="white" {...({} as any)}>
                Settings
              </Typography>
            </ListItem>
          </Link>
        </List>
      </div>
    </div>
  );
}
