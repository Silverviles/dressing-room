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

export default function Cloths() {
  const [activeTab, setActiveTab] = useState("add");

  const data = [
    { label: "Add Cloth", value: "add" },
    { label: "Update Cloth", value: "update" },
  ];

  return (
    <Card className="border-2 border-gray-800 rounded-t-lg" {...({} as any)}>
      <div className="bg-gray-800 rounded-t-sm p-1">
        <Typography
          color="white"
          variant="h4"
          className="text-center uppercase"
          {...({} as any)}
        >
          Cloth Section
        </Typography>
      </div>

      <div className="grid grid-cols-2 p-2 gap-2">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsHeader {...({} as any)}>
            {data.map(({ label, value }) => (
              <Tab key={value} value={value} {...({} as any)}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody {...({} as any)}>
            {data.map(({ value }) => (
              <TabPanel key={value} value={value}>
                {value === "add" ? (
                  <Card className="border-2 border-gray-800" {...({} as any)}>
                    <div className="bg-gray-800 rounded-t-lg p-1">
                      <Typography
                        className="text-center uppercase"
                        color="white"
                        {...({} as any)}
                      >
                        Add Cloth
                      </Typography>
                    </div>
                    <div className="grid grid-rows-4 gap-3 p-2">
                      <Input label="Cloth Name" {...({} as any)} />
                      <Select label="Cloth Type" {...({} as any)}>
                        <Option>Shirt</Option>
                        <Option>Pants</Option>
                        <Option>Shoes</Option>
                        <Option>Flock</Option>
                      </Select>
                      <Input label="Brand" {...({} as any)} />{" "}
                      <Input
                        type="file"
                        label="Upload Image"
                        {...({} as any)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button {...({} as any)}>Cancel</Button>
                        <Button color="red" {...({} as any)}>
                          Add Cloth
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="border-2 border-gray-800" {...({} as any)}>
                    <div className="bg-gray-800 rounded-t-lg p-1">
                      <Typography
                        className="text-center uppercase"
                        color="white"
                        {...({} as any)}
                      >
                        Update Cloth
                      </Typography>
                    </div>
                    <div className="grid grid-rows-4 gap-3 p-2">
                      <Select label="Select Cloth" {...({} as any)}>
                        <Option>Shirt</Option>
                        <Option>Pants</Option>
                        <Option>Shoes</Option>
                        <Option>Flock</Option>
                      </Select>
                      <Input label="New Cloth Name" {...({} as any)} />
                      <Input label="New Brand" {...({} as any)} />
                      <Input
                        type="file"
                        label="Upload Image"
                        {...({} as any)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button {...({} as any)}>Cancel</Button>
                        <Button color="red" {...({} as any)}>
                          Update Cloth
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
        <Card className="border-2 border-gray-800" {...({} as any)}>
          <div className="bg-gray-800 rounded-t-lg p-1">
            <Typography
              className="text-center uppercase"
              color="white"
              {...({} as any)}
            >
              View Clothes
            </Typography>
          </div>
        </Card>
      </div>
    </Card>
  );
}
