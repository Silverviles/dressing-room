// @ts-nocheck
// No type checking in this file

import {faBell, faChevronDown, faCog, faMailBulk, faSignOut, faUser} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button, Menu, MenuHandler, MenuItem, MenuList,

  Typography,
} from "@material-tailwind/react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {LoginWithGoogle, LogoutUser} from "../controller/auth.controller.js";
import {useState} from "react";
import {COLORS} from "../utils/constants/colors.js";

export default function Header() {

  const user = useSelector((state) => state.user);
  return (
    <div>
      <div className="flex justify-between p-2  items-center" style={{backgroundColor: COLORS.HEADER}}>
        <div className="flex flex-center items-center gap-2">
          <Avatar
            size="sm"
            src="https://img.freepik.com/free-vector/fashion-business-logo-template-branding-design-black-white-vector_53876-156444.jpg?w=740&t=st=1725700280~exp=1725700880~hmac=6b541126f2074eed575b8aedb10e89a8f0c89b68d22bcd0eca87f216e8fdb27d"
          />
          <Typography
            style={{ fontFamily: "'Italiana', serif" }}
            variant="h4"
            color="white"
          >
            StarLight
          </Typography>
        </div>
        <div>

          <ul className="flex flex-row gap-4 text-white font-semibold">
            <Link to={'/'}>
              <li className="cursor-pointer text-sm">Home</li>
            </Link>
            <Link to={'/about'}>
              <li className="cursor-pointer text-sm">About Us</li>
            </Link>
            {user.user && (
                <Link to={'/dashboard?tab=cloth'}>
                  <li className="cursor-pointer text-sm">My Clothes</li>
                </Link>)
            }
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

  const handleLogout = async () => {
    await LogoutUser(dispatch);
  }
  const handleGoogleLogin = async () => {
    await LoginWithGoogle(dispatch);
  };

  return (
      <div>
        {user.user ? (
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
                      src={user.photoURL}
                  />
                  <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`h-3 w-3 text-gray-800 transition-transform ${
                          isMenuOpen ? "rotate-180" : ""
                      }`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon }, key) => {
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
        ): (
            <div>
              <Button
                  onClick={handleGoogleLogin}
                  variant="text"
                  ripple="light"
                    className="text-white"
                >
                    Login
                </Button>
            </div>
        )}
      </div>
  );
}



const profileMenuItems = [
  {
    label: "My Profile",
    icon: faUser,
  },
  {
    label: "Settings",
    icon: faCog,
  },
  {
    label: "Inbox",
    icon: faMailBulk,
  },

  {
    label: "Sign Out",
    icon: faSignOut,
  },
];
