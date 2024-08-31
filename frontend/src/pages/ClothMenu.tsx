// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import {
  Avatar,
  Button,
  Card,
  Input,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Typography,
} from "@material-tailwind/react";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../utils/firebase";

export default function ClothMenu() {
  const [clothDetails, setClothDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    image: "",
  });
  const handleOnChangeSubmit = (e) => {
    setClothDetails({ ...clothDetails, [e.target.name]: e.target.value });
  };

  const handleClothSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cloths"), clothDetails);
      console.log("Cloth added successfully!");
    } catch (error) {
      console.error("Error adding cloth: ", error);
    }
  };
  return (
    <Card className=" w-full h-screen border-2 border-gray-800">
      <div className="bg-gray-800 p-1 rounded-t-lg">
        <Typography color="white" className="text-center uppercase">
          Cloth Section
        </Typography>
      </div>
      <div className="mt-2 flex justify-end p-2">
        <Popover placement="bottom-start">
          <PopoverHandler>
            <Button>Add New Cloth</Button>
          </PopoverHandler>
          <PopoverContent>
            <div>
              <Typography
                color="blue-gray"
                variant="h6"
                className="text-center"
              >
                Add New Cloth
              </Typography>
              <form
                className="grid grid-rows-4 gap-3 p-2"
                onSubmit={handleClothSubmit}
              >
                <Input
                  label="Cloth Name"
                  name="clothName"
                  onChange={handleOnChangeSubmit}
                />
                <Select
                  name="clothType"
                  label="Cloth Type"
                  // onChange={(value) =>
                  //   setClothDetails({ ...clothDetails, clothType: value })
                  // }
                >
                  <Option value="shirt">Shirt</Option>
                  <Option value="pants">Pants</Option>
                  <Option value="shoes">Shoes</Option>
                  <Option value="flock">Flock</Option>
                </Select>
                <Input
                  label="Brand"
                  name="brand"
                  onChange={handleOnChangeSubmit}
                />
                <Input
                  type="text"
                  label="Upload Image"
                  name="image"
                  onChange={handleOnChangeSubmit}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" type="button">
                    Cancel
                  </Button>
                  <Button size="sm" type="submit" color="red">
                    Add Cloth
                  </Button>
                </div>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-2 p-2 ">
        <Card className="border-2 border-gray-800 h-52">
          <div className="flex gap-4 bg-gray-800 rounded-t-lg p-2">
            <Avatar
              size="lg"
              className="border-2 border-gray-800"
              src="https://th.bing.com/th/id/OIP.DA3RRikwpu7rpDJYkPhvuwHaGW?rs=1&pid=ImgDetMain"
            />

            <div>
              <Typography className="-mb-2" color="white" variant="h4">
                Cloth Name
              </Typography>
              <Typography color="white" variant="paragraph">
                Shirt
              </Typography>
            </div>
          </div>
          <div className="p-2">
            <Typography>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil
              aut mollitia sit totam asperiores ut atque,
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <Button size="sm" color="blue">
              Update
            </Button>
            <Button size="sm" color="red">
              Remove
            </Button>
          </div>
        </Card>

        <Card className="border-2 border-gray-800 h-52">hello</Card>

        <Card className="border-2 border-gray-800 h-52">hello</Card>

        <Card className="border-2 border-gray-800 h-52">hello</Card>

        <Card className="border-2 border-gray-800 h-52">hello</Card>

        <Card className="border-2 border-gray-800 h-52">hello</Card>
      </div>
    </Card>
  );
}
