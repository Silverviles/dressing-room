// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import { Avatar } from "@material-tailwind/react";

export default function NavigationBar() {
  return (
    <div className=" flex justify-between bg-gray-900 mb-2 p-2 items-center">
      <div></div>
      <div>
        <ul className="text-white grid grid-cols-3 gap-2">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">About</li>
          <li className="cursor-pointer">Dressing Room</li>
        </ul>
      </div>

      <div>
        <Avatar
          src="https://img.freepik.com/free-vector/flat-style-woman-avatar_90220-2876.jpg?w=740&t=st=1725166572~exp=1725167172~hmac=b1ac1380a4d3aa102bd33a5eae959c94ec8511b91eeee9b13b993f4d0ae286b7"
          size="sm"
        />
      </div>
    </div>
  );
}
