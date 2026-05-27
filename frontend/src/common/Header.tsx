// @ts-nocheck

import Logo from "../images/logo.png";

import {faBell, faChevronDown, faCog, faMailBulk, faSignOut, faUser} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button, Menu, MenuHandler, MenuItem, MenuList,
  Typography,
} from "@material-tailwind/react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {logoutCurrentUser} from "../controller/auth.controller.js";
import {useState} from "react";

export default function Header() {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <div className="flex justify-between p-2  items-center bg-gray-900" >
        <div className="flex flex-center items-center gap-2 ml-2">
          <Avatar
            size="sm"
            src={Logo}
          />
          <Typography
            style={{ fontFamily: "'Italiana', serif" }}
            variant="h4"
            color="white"
          >
            Dress Me
          </Typography>
        </div>
        <div>
          <ul className="flex flex-row gap-4 text-white font-semibold">
            <Link to={'/'}>
              <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Home</li>
            </Link>
            {user.isAuthenticated && (
              <div className={'flex flex-row gap-4'}>
                <Link to={'/dress'}>
                  <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Dress Room</li>
                </Link>
                <Link to={'/favorites'}>
                  <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Favorites</li>
                </Link>
                <Link to={'/skin-color'}>
                  <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Skin Color</li>
                </Link>
                <Link to={'/presets'}>
                  <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Presets</li>
                </Link>
                {user.user?.role === "admin" && (
                  <Link to={'/cloth'}>
                    <li className="cursor-pointer text-sm" style={{ fontFamily: "Abril Fatface" }}>Manage Clothes</li>
                  </Link>
                )}
              </div>
            )}
          </ul>
        </div>
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faBell}
            color="white"
            className="border-2 p-2 rounded-full"
          />
          <ProfileMenu/>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu() {
  const user = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutCurrentUser(dispatch);
    navigate("/");
  };

  return (
    <div>
      {user.isAuthenticated ? (
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              color="blue-gray"
              className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 "
            >
              <Avatar
                variant="circular"
                size="sm"
                alt="user-image"
                className="border border-gray-800 p-0.5"
                src="https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg"
              />
              <Typography color="white" className="text-sm hidden md:block">
                {user.user?.username}
              </Typography>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`h-3 w-3 text-white transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </MenuHandler>
          <MenuList className="p-1">
            {profileMenuItems.map(({label, icon}, key) => {
              const isLastItem = key === profileMenuItems.length - 1;
              return (
                <MenuItem
                  key={label}
                  onClick={
                    label === "Sign Out"
                      ? handleLogout
                      : label === "My Profile"
                        ? () => navigate("/profile")
                        : closeMenu
                  }
                  className={`flex items-center gap-2 rounded ${
                    isLastItem
                      ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                      : "text-gray-900 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={`h-4 w-4 ${isLastItem ? "text-red-500" : ""}`}
                  />
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color={isLastItem ? "red" : "inherit"}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      ) : (
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="text" ripple="light" className="text-white">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outlined" ripple="light" className="text-white border-white">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

const profileMenuItems = [
  { label: "My Profile", icon: faUser },
  { label: "Settings", icon: faCog },
  { label: "Inbox", icon: faMailBulk },
  { label: "Sign Out", icon: faSignOut },
];
