// @ts-nocheck
const someVariable: string = 42; // No type checking in this file

import {
  faArrowDown,
  faArrowDown19,
  faArrowPointer,
  faChevronDown,
  faFemale,
  faMale,
  faPerson,
  faTShirt,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowDownShortWide } from "@fortawesome/free-solid-svg-icons/faArrowDownShortWide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Button,
  Card,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";

const data = [
  {
    name: "Summer Dress",
    image:
      "https://www.business-magazine.org/wp-content/uploads/Best-Summer-Dresses-2019.jpg",
  },
  {
    name: "Mens Dress",
    image:
      "https://i.pinimg.com/originals/35/24/2c/35242c90c977376a5741d9d5e41635cd.jpg",
  },
  {
    name: "Summer Dress",
    image:
      "https://www.business-magazine.org/wp-content/uploads/Best-Summer-Dresses-2019.jpg",
  },
  {
    name: "Summer Dress",
    image:
      "https://www.business-magazine.org/wp-content/uploads/Best-Summer-Dresses-2019.jpg",
  },
  {
    name: "Summer Dress",
    image:
      "https://www.business-magazine.org/wp-content/uploads/Best-Summer-Dresses-2019.jpg",
  },
  {
    name: "Summer Dress",
    image:
      "https://www.business-magazine.org/wp-content/uploads/Best-Summer-Dresses-2019.jpg",
  },
];

export default function Home() {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <div>
      <div className="flex">
        <div className="h-screen">
          <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
              <Typography
                style={{ fontFamily: "'Italiana', serif" }}
                className="font-extrabold"
                variant="h6"
                color="blue-gray"
              >
                Filter By
              </Typography>
            </div>
            <List>
              <Accordion
                open={open === 1}
                icon={
                  <FontAwesomeIcon
                    strokeWidth={2.5}
                    icon={faChevronDown}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === 1 ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 1}>
                  <AccordionHeader
                    onClick={() => handleOpen(1)}
                    className="border-b-0 p-3"
                  >
                    <Typography
                      color="blue-gray"
                      style={{ fontFamily: "'Italiana', serif" }}
                      className="mr-auto font-semibold"
                    >
                      Women
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List
                    className="p-0 ml-4 font-semibold text-gray-900"
                    style={{ fontFamily: "'Italiana', serif" }}
                  >
                    <ListItem>Tops</ListItem>
                    <ListItem>Dresses & Jumpsuits</ListItem>
                    <ListItem>Outerwear</ListItem>
                    <ListItem>Bottoms</ListItem>
                    <ListItem>Swimwear</ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={open === 2}
                icon={
                  <FontAwesomeIcon
                    strokeWidth={2.5}
                    icon={faChevronDown}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === 2 ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={open === 2}>
                  <AccordionHeader
                    onClick={() => handleOpen(2)}
                    className="border-b-0 p-3"
                  >
                    <Typography
                      color="blue-gray"
                      style={{ fontFamily: "'Italiana', serif" }}
                      className="mr-auto  font-semibold"
                    >
                      Men
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 ">
                  <List
                    className="p-0 ml-5 font-semibold text-gray-900"
                    style={{ fontFamily: "'Italiana', serif" }}
                  >
                    <ListItem>Suits & Blazers</ListItem>
                    <ListItem>Pants & Shorts</ListItem>
                    <ListItem>Shirts</ListItem>
                    <ListItem>Tops</ListItem>
                    <ListItem>Bottoms</ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            </List>
          </Card>
        </div>
        {/* Main Content */}
        <div className="bg-gray-200 w-full h-screen ">
          <div className="px-4 py-4 flex justify-end">
            <Button style={{ fontFamily: "'Italiana', serif" }}>
              Try My Dress
            </Button>
          </div>

          <div
            className="mt-4 grid grid-cols-3 px-4 gap-2 mb-2 overflow-y-auto"
            style={{ height: "85vh" }}
          >
            {data.map((item, index) => (
              <Card className="w-full p-2 h-[30rem]">
                <img
                  className="rounded-lg h-[26rem] w-full object-cover"
                  src={item.image}
                />
                <div className="flex items-center justify-between">
                  <Typography
                    className="text-gray-900 font-semibold text-center mt-2"
                    variant="h6"
                    style={{ fontFamily: "'Italiana', serif" }}
                  >
                    {item.name}
                  </Typography>

                  <Button
                    size="sm"
                    className="mt-2 bg-gray-900 top-2 right-2 rounded-full z-10"
                  >
                    <div className="flex gap-2  items-center">
                      <Typography className="text-sm">Try Now</Typography>
                      <FontAwesomeIcon
                        size="sm"
                        color="white"
                        icon={faTShirt}
                      />
                    </div>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
