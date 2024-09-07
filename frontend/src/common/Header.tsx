// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import { faBell, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Alert,
  Avatar,
  ListItem,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
} from "@material-tailwind/react";

export default function Header() {
  function Icon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    );
  }
  return (
    <div>
      <div className="flex justify-between p-2 bg-gray-900 items-center">
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
          <ul className="grid grid-cols-2 gap-2 text-white font-semibold">
            <li className="cursor-pointer ">Home</li>
            <li className="cursor-pointer">profile</li>
          </ul>
        </div>
        <div className="flex gap-2 items-center">
          <FontAwesomeIcon
            icon={faBell}
            color="white"
            className="border-2 p-2 rounded-full"
          />
          <Popover placement="bottom-start">
            <PopoverHandler>
              <Avatar
                size="sm"
                src="https://img.freepik.com/premium-vector/collection-hand-drawn-profile-icons_1323905-5.jpg?w=740"
              />
            </PopoverHandler>
            <PopoverContent className="rounded-lg">
              <ul className="text-black w-40">
                <ListItem className="cursor-pointer gap-4">
                  <FontAwesomeIcon
                    className="p-1 border-2 rounded-full border-gray-800"
                    icon={faUser}
                  />{" "}
                  Profile
                </ListItem>
                <ListItem className="cursor-pointer gap-4">
                  <FontAwesomeIcon
                    className="p-1 border-2 rounded-full border-gray-800"
                    icon={faSignOut}
                  />{" "}
                  Logout
                </ListItem>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
