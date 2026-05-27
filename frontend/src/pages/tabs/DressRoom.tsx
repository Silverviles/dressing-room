// @ts-nocheck

import { lazy, Suspense } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addFavorite,
  fetchClothes,
  fetchFavorites,
  removeFavorite,
} from "../../controller/cloth.controller.ts";
import { resolveAssetUrl } from "../../api/client.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faHeart, faTShirt } from "@fortawesome/free-solid-svg-icons";
import Video from "../../components/Video.tsx";

const ClothTryoutReport = lazy(() => import("../../components/ClothTryoutReport.tsx"));
const Chatbot = lazy(() => import("../../components/Chatbot.tsx"));

export const DressRoom = () => {
  const token = useSelector((state) => state.user.token);
  const [clothes, setClothes] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [selectedCloth, setSelectedCloth] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const loadData = async () => {
    const [clothList, favorites] = await Promise.all([
      fetchClothes(token),
      fetchFavorites(token),
    ]);
    setClothes(clothList || []);
    setFavoriteIds(new Set((favorites || []).map((cloth) => cloth.id)));
  };

  useEffect(() => {
    if (token) {
      loadData().catch((error) => console.error("Failed to load dress room data", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleClothSelect = (clothImage) => {
    setSelectedCloth(resolveAssetUrl(clothImage));
  };

  const toggleFavorite = async (clothId) => {
    try {
      if (favoriteIds.has(clothId)) {
        await removeFavorite(token, clothId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(clothId);
          return next;
        });
      } else {
        await addFavorite(token, clothId);
        setFavoriteIds((prev) => new Set(prev).add(clothId));
      }
    } catch (error) {
      console.error("Failed to update favorite", error);
    }
  };

  const openStoreLink = (storeUrl) => {
    if (storeUrl) {
      window.open(storeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full flex gap-2 p-4">
      <Card className="w-3/12 h-screen">
        <Typography className="text-center bg-gray-800 text-white rounded-t-lg p-2" style={{ fontFamily: "Abril Fatface" }}>
          Your Clothes
        </Typography>
        <div className="p-2 overflow-y-auto h-full">
          {clothes.map((cloth) => (
            <Card key={cloth.id} className="p-2 m-2 bg-gray-100 rounded-lg relative">
              <Chip color="amber" className="text-center absolute top-5 left-5 z-10" value={cloth.clothType} />
              <button
                className="absolute top-5 right-5 z-10"
                onClick={() => toggleFavorite(cloth.id)}
                aria-label="Toggle favorite"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={favoriteIds.has(cloth.id) ? "text-red-500" : "text-gray-400"}
                />
              </button>
              <img
                src={resolveAssetUrl(cloth.imageUrl) || "https://via.placeholder.com/150"}
                alt={cloth.clothName}
                className="object-cover"
              />
              <CardBody className="p-2 pb-0">
                <Typography className="text-center text-gray-800 text-lg font-semibold" style={{ fontFamily: "Abril Fatface" }}>
                  {cloth.clothName}
                </Typography>
                <Typography className="text-center text-gray-800" style={{ fontFamily: "Abril Fatface" }}>
                  {cloth.brand}
                </Typography>
              </CardBody>
              <CardFooter className="p-0 pb-2 flex flex-col gap-2">
                <Button
                  onClick={() => handleClothSelect(cloth.imageUrl)}
                  fullWidth
                  className="flex gap-2 items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTShirt} />
                  <Typography className="text-xs">Try Out</Typography>
                </Button>
                {cloth.storeUrl && (
                  <Button
                    onClick={() => openStoreLink(cloth.storeUrl)}
                    fullWidth
                    variant="outlined"
                    className="flex gap-2 items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                    <Typography className="text-xs">View in Store</Typography>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Card>
      <Card className="items-center pt-4 px-4">
        {selectedCloth === "" && (
          <Typography className="mb-2 text-sm text-gray-900" style={{ fontFamily: "Abril Fatface" }}>
            Select a cloth
          </Typography>
        )}
        <Video key={selectedCloth} image={selectedCloth} />
        <Suspense fallback={null}>
          <ClothTryoutReport />
        </Suspense>
      </Card>
      <Card className="w-4/12 overflow-y-scroll h-screen" id="scnShotDiv" />
      <div className="relative">
        <div className="fixed bottom-4 right-10 w-128">
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          >
            {isChatbotOpen ? "Close Assistant" : "Assistant"}
          </button>
          {isChatbotOpen && (
            <div
              className="mt-2 w-full bg-gray-200 p-2 rounded-lg"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <Suspense fallback={<div className="text-sm text-gray-600 p-2">Loading assistant...</div>}>
                <Chatbot />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
