// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import {
  Button,
  Card,
  Input,
  Option,
  Select,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

export default function Cloths() {
  const [activeTab, setActiveTab] = useState("add");
  const [clothDetails, setClothDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    image: "",
  });

  const data = [
    { label: "Add Cloth", value: "add" },
    { label: "Update Cloth", value: "update" },
  ];

  const handleOnChangeSubmit = (e) => {
    setClothDetails({ ...clothDetails, [e.target.name]: e.target.value });
  };

  console.log("Cloth Details: ", clothDetails);

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
    <Card className="border-2 border-gray-800 rounded-t-lg">
      <div className="bg-gray-800 rounded-t-sm p-1">
        <Typography
          color="white"
          variant="h4"
          className="text-center uppercase"
        >
          Cloth Section
        </Typography>
      </div>

      <div className="grid grid-cols-2 p-2 gap-2">
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <TabsHeader>
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value }) => (
              <TabPanel key={value} value={value}>
                {value === "add" ? (
                  <Card className="border-2 border-gray-800">
                    <div className="bg-gray-800 rounded-t-lg p-1">
                      <Typography
                        className="text-center uppercase"
                        color="white"
                      >
                        Add Cloth
                      </Typography>
                    </div>
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
                        onChange={(value) =>
                          setClothDetails({ ...clothDetails, clothType: value })
                        }
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
                        <Button type="button">Cancel</Button>
                        <Button type="submit" color="red">
                          Add Cloth
                        </Button>
                      </div>
                    </form>
                  </Card>
                ) : (
                  <Card className="border-2 border-gray-800">
                    <div className="bg-gray-800 rounded-t-lg p-1">
                      <Typography
                        className="text-center uppercase"
                        color="white"
                      >
                        Update Cloth
                      </Typography>
                    </div>
                    <div className="grid grid-rows-4 gap-3 p-2">
                      <Select label="Select Cloth">
                        <Option value="shirt">Shirt</Option>
                        <Option value="pants">Pants</Option>
                        <Option value="shoes">Shoes</Option>
                        <Option value="flock">Flock</Option>
                      </Select>
                      <Input label="New Cloth Name" />
                      <Input label="New Brand" />
                      <Input type="file" label="Upload Image" />
                      <div className="grid grid-cols-2 gap-2">
                        <Button type="button">Cancel</Button>
                        <Button color="red">Update Cloth</Button>
                      </div>
                    </div>
                  </Card>
                )}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
        <Card className="border-2 border-gray-800">
          <div className="bg-gray-800 rounded-t-lg p-1">
            <Typography className="text-center uppercase" color="white">
              View Clothes
            </Typography>
          </div>
        </Card>
      </div>
    </Card>
  );
}
