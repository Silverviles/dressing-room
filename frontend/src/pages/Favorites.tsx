// @ts-nocheck

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Typography,
} from "../common/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { fetchFavorites, removeFavorite } from "../controller/cloth.controller.ts";
import { resolveAssetUrl } from "../api/client.ts";

export default function Favorites() {
  const token = useSelector((state) => state.user.token);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await fetchFavorites(token);
      setFavorites(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFavorites().catch((error) => console.error("Failed to load favorites", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRemoveFavorite = async (clothId) => {
    await removeFavorite(token, clothId);
    setFavorites((prev) => prev.filter((cloth) => cloth.id !== clothId));
  };

  const openStoreLink = (storeUrl) => {
    if (storeUrl) {
      window.open(storeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h3" className="text-center mb-6" style={{ fontFamily: "Abril Fatface" }}>
        My Favorites
      </Typography>

      {loading && (
        <Typography className="text-center text-gray-600">Loading favorites...</Typography>
      )}

      {!loading && favorites.length === 0 && (
        <Typography className="text-center text-gray-600">
          No favorites yet. Heart items in the Dress Room to save them here.
        </Typography>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((cloth) => (
          <Card key={cloth.id} className="p-4">
            <Chip color="amber" className="absolute top-4 left-4 z-10" value={cloth.clothType} />
            <img
              src={resolveAssetUrl(cloth.imageUrl)}
              alt={cloth.clothName}
              className="h-72 object-cover rounded-md"
            />
            <CardBody>
              <Typography className="text-center text-xl font-semibold" style={{ fontFamily: "Abril Fatface" }}>
                {cloth.clothName}
              </Typography>
              <Typography className="text-center text-gray-700">{cloth.brand}</Typography>
            </CardBody>
            <div className="flex gap-2 px-4 pb-4">
              {cloth.storeUrl && (
                <Button
                  fullWidth
                  className="flex items-center justify-center gap-2"
                  onClick={() => openStoreLink(cloth.storeUrl)}
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  View in Store
                </Button>
              )}
              <Button
                fullWidth
                color="red"
                variant="outlined"
                className="flex items-center justify-center gap-2"
                onClick={() => handleRemoveFavorite(cloth.id)}
              >
                <FontAwesomeIcon icon={faHeartBroken} />
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
