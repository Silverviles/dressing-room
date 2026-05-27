// @ts-nocheck

import { lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Option,
  Popover,
  PopoverContent,
  PopoverHandler,
  Select,
  Typography,
} from "../../common/ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AlertComponent } from "../../common/AlertComponent.tsx";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  createCloth,
  deleteCloth,
  fetchClothes,
  updateCloth,
} from "../../controller/cloth.controller.ts";
import { resolveAssetUrl } from "../../api/client.ts";

const ReportComponent = lazy(() => import("../../components/ReportComponent.tsx"));

export default function ClothMenu() {
  const token = useSelector((state) => state.user.token);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [cloths, setCloths] = useState([]);
  const [alertDetails, setAlertDetails] = useState({
    alert_topic: "",
    alert_message: "",
    is_success: false,
  });
  const [clothDetails, setClothDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    storeUrl: "",
  });

  const loadClothes = async () => {
    const clothes = await fetchClothes(token);
    setCloths(clothes || []);
  };

  useEffect(() => {
    if (isAlertOpen) {
      const timer = setTimeout(() => {
        setIsAlertOpen(false);
        setAlertDetails({
          alert_topic: "",
          alert_message: "",
          is_success: false,
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAlertOpen]);

  useEffect(() => {
    if (token) {
      loadClothes().catch((error) => {
        console.error("Error fetching clothes", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleOnChangeSubmit = (event) => {
    setClothDetails({ ...clothDetails, [event.target.name]: event.target.value });
  };

  const handleClothSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Please select an image to upload.",
      });
      setIsAlertOpen(true);
      return;
    }

    if (!clothDetails.clothType) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Please select a cloth type.",
      });
      setIsAlertOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clothName", clothDetails.clothName);
      formData.append("clothType", clothDetails.clothType);
      formData.append("brand", clothDetails.brand);
      formData.append("storeUrl", clothDetails.storeUrl);
      formData.append("image", file);

      await createCloth(token, formData);
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: true,
        alert_message: "Cloth added successfully!",
      });
      setIsAlertOpen(true);
      setClothDetails({ clothName: "", clothType: "", brand: "", storeUrl: "" });
      setFile(null);
      await loadClothes();
    } catch (error) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error adding a new cloth. Retry: " + error.message,
      });
      setIsAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCloth = async (id) => {
    try {
      await deleteCloth(token, id);
      setCloths(cloths.filter((cloth) => cloth.id !== id));
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: true,
        alert_message: "Cloth removed successfully!",
      });
      setIsAlertOpen(true);
    } catch (error) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error while removing cloth! Error: " + error.message,
      });
      setIsAlertOpen(true);
    }
  };

  const [editDetails, setEditDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    storeUrl: "",
  });

  const openEditPopover = (cloth) => {
    setEditDetails({
      clothName: cloth.clothName,
      clothType: cloth.clothType,
      brand: cloth.brand,
      storeUrl: cloth.storeUrl || "",
    });
  };

  const handleUpdateCloth = async (id) => {
    try {
      const formData = new FormData();
      formData.append("clothName", editDetails.clothName);
      formData.append("clothType", editDetails.clothType);
      formData.append("brand", editDetails.brand);
      formData.append("storeUrl", editDetails.storeUrl || "");

      await updateCloth(token, id, formData);
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: true,
        alert_message: "Cloth updated successfully!",
      });
      setIsAlertOpen(true);
      await loadClothes();
    } catch (error) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error updating cloth. Retry. Error: " + error.message,
      });
      setIsAlertOpen(true);
    }
  };

  return (
    <div>
      <AlertComponent
        isOpen={isAlertOpen}
        topic={alertDetails.alert_topic || "Clothes"}
        is_success={alertDetails.is_success || false}
        alert_message={alertDetails.alert_message || ""}
      />

      <div className="min-h-screen mb-4">
        <div
          className="p-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://img.freepik.com/free-vector/seamless-woman-s-stylish-bags-retro-pattern_98292-4349.jpg')`,
          }}
        >
          <Typography variant="h1" className="text-center text-white" style={{ fontFamily: "Abril Fatface" }}>
            Cloth Section
          </Typography>
          <div className="w-11/12 flex items-center justify-center text-center mx-auto">
            <Typography className="text-center justify-center text-sm text-white" style={{ fontFamily: "Abril Fatface" }}>
              Admin wardrobe management. Add clothing items with images and retail store links for users to try on virtually.
            </Typography>
          </div>
        </div>

        <div className="flex justify-end p-2 items-center gap-2 mt-4">
          <Suspense fallback={null}>
            <ReportComponent reportData={cloths} />
          </Suspense>
          <Popover placement="bottom-start">
            <PopoverHandler>
              <Button className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                <Typography className="text-xs font-semibold">Add New Cloth</Typography>
              </Button>
            </PopoverHandler>
            <PopoverContent>
              <Typography color="blue-gray" variant="h6" className="text-center">
                Add New Cloth
              </Typography>
              <form className="grid grid-rows-5 gap-3 p-2" onSubmit={handleClothSubmit}>
                <Input label="Cloth Name" name="clothName" onChange={handleOnChangeSubmit} required />
                <Select
                  name="clothType"
                  label="Cloth Type"
                  onChange={(value) => setClothDetails({ ...clothDetails, clothType: value })}
                >
                  <Option value="shirt">Shirt</Option>
                  <Option value="pants">Pants</Option>
                  <Option value="shoes">Shoes</Option>
                  <Option value="flock">Flock</Option>
                </Select>
                <Input label="Brand" name="brand" onChange={handleOnChangeSubmit} required />
                <Input label="Store URL" name="storeUrl" onChange={handleOnChangeSubmit} />
                <Input
                  type="file"
                  label="Upload Image"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" type="button">Cancel</Button>
                  <Button disabled={isSubmitting} loading={isSubmitting} size="sm" type="submit" color="red">
                    {isSubmitting ? "Uploading..." : "Add Cloth"}
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-screen grid grid-cols-3 p-4">
          {cloths.map((cloth) => (
            <div className="mb-4" key={cloth.id}>
              <Card className="w-96 h-full p-4">
                <Chip color="yellow" className="absolute top-2 right-2 z-20" value={cloth.clothType} />
                <img className="h-96 object-cover" alt={cloth.clothName} src={resolveAssetUrl(cloth.imageUrl)} />
                <CardBody>
                  <Typography className="text-center font-semibold text-gray-900 text-2xl" style={{ fontFamily: "Abril Fatface" }}>
                    {cloth.clothName}
                  </Typography>
                  <Typography className="text-center text-gray-900 mb-2" style={{ fontFamily: "Abril Fatface" }}>
                    {cloth.brand}
                  </Typography>
                  {cloth.storeUrl && (
                    <Typography className="text-center text-blue-600 text-sm break-all">
                      {cloth.storeUrl}
                    </Typography>
                  )}
                </CardBody>

                <div className="grid grid-cols-2 gap-2 -mt-6">
                  <Popover placement="bottom-start">
                    <PopoverHandler>
                      <Button variant="outlined" size="sm" color="blue" onClick={() => openEditPopover(cloth)}>
                        Update
                      </Button>
                    </PopoverHandler>
                    <PopoverContent>
                      <Typography className="text-center" color="blue-gray" variant="h6">
                        Update Cloth
                      </Typography>
                      <form
                        className="grid grid-rows-5 gap-3 p-2"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleUpdateCloth(cloth.id);
                        }}
                      >
                        <Input
                          label="Cloth Name"
                          name="clothName"
                          value={editDetails.clothName}
                          onChange={(event) => setEditDetails({ ...editDetails, clothName: event.target.value })}
                          required
                        />
                        <Select
                          name="clothType"
                          label="Cloth Type"
                          value={editDetails.clothType}
                          onChange={(value) => setEditDetails({ ...editDetails, clothType: value })}
                        >
                          <Option value="shirt">Shirt</Option>
                          <Option value="pants">Pants</Option>
                          <Option value="shoes">Shoes</Option>
                          <Option value="flock">Flock</Option>
                        </Select>
                        <Input
                          label="Brand"
                          value={editDetails.brand}
                          name="brand"
                          onChange={(event) => setEditDetails({ ...editDetails, brand: event.target.value })}
                          required
                        />
                        <Input
                          label="Store URL"
                          value={editDetails.storeUrl}
                          name="storeUrl"
                          onChange={(event) => setEditDetails({ ...editDetails, storeUrl: event.target.value })}
                        />
                        <Button size="sm" type="submit" color="blue">Update Cloth</Button>
                      </form>
                    </PopoverContent>
                  </Popover>
                  <Popover placement="bottom-start">
                    <PopoverHandler>
                      <Button variant="outlined" size="sm" color="red">Remove</Button>
                    </PopoverHandler>
                    <PopoverContent className="border-2 border-gray-900 bg-gray-800">
                      <div className="gap-2 grid grid-rows-2">
                        <Typography variant="h6" color="white">
                          Want to remove this dress?
                        </Typography>
                        <Button onClick={() => handleDeleteCloth(cloth.id)} variant="filled" size="sm" color="red">
                          Remove
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
