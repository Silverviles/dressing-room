// @ts-nocheck

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { fetchClothes } from "../../controller/cloth.controller.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTShirt } from "@fortawesome/free-solid-svg-icons";
import Video from "../../components/Video.tsx";
import Chatbot from "../../components/Chatbot.tsx";

export const DressRoom = () => {
  const [clothes, setClothes] = useState([]);
  const [selectedCloth, setSelectedCloth] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleClothSelect = (clothImage) => {
    setSelectedCloth(clothImage);
    console.log("Selected cloth", clothImage);
  };

  useEffect(() => {
    fetchClothes().then((cloths) => {
      setClothes(cloths || []);
      console.log("Clothes fetched successfully", cloths);
    });
  }, []);

  return (
    <div className="w-full flex gap-2 ">
      <Card className="w-3/12 h-screen ">
        <Typography className="text-center bg-gray-800 text-white rounded-t-lg p-2" style={{
          fontFamily: "Abril Fatface",
        }}>
          Your Clothes
        </Typography>
        <div className="p-2 overflow-y-auto h-full">
          {clothes.map((cloth) => (
            <Card key={cloth.id} className="p-2 m-2 bg-gray-100 rounded-lg ">
              <Chip
                color={"amber"}
                className="text-center absolute top-5 left-5"
                value={cloth.clothType}
              />
              <img
                src={
                  cloth.image ? cloth.image : "https://via.placeholder.com/150"
                }
                alt={cloth.clothName}
                className="object-cover"
              />
              <CardBody className="p-2 pb-0">
                <Typography className="text-center text-gray-800 text-lg font-semibold" style={{
                  fontFamily: "Abril Fatface",
                }}>
                  {cloth.clothName}
                </Typography>
                <Typography className="text-center text-gray-800" style={{
                  fontFamily: "Abril Fatface",
                }}>
                  {cloth.brand}
                </Typography>
              </CardBody>
              <CardFooter className="p-0 pb-2">
                <Button
                  onClick={() => handleClothSelect(cloth.image)}
                  fullWidth
                  className="flex gap-2 items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTShirt} />
                  <Typography className="text-xs">Try Out</Typography>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Card>
      <Card className="items-center pt-4 px-4">
        {selectedCloth == "" && (
            <Typography className={"mb-2 text-sm text-gray-900"}
                        style={{fontFamily: "Abril Fatface",}}>
              Select a cloth
            </Typography>)}
        <Video key={selectedCloth} image={selectedCloth} />
      </Card>
      <Card className="w-3/12 overflow-y-scroll" id="scnShotDiv">
        {/* Screenshot functionality can go here */}
      </Card>
      <div className="relative">
          <div className="fixed bottom-4 right-10 w-128">
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg"
              onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            >
              {isChatbotOpen ? "Close Assistant" : "Assistant"}
            </button>
            {isChatbotOpen && (
              <div className="mt-2 w-full bg-gray-200 p-2 rounded-lg"
              style={{
                maxHeight: "400px", // Set a maximum height for the chatbot
                overflowY: "auto", // Enable scrolling when content exceeds the height
              }}>
                <Chatbot />
              </div>
            )}
          </div>
        </div>
    </div>
  );
};
