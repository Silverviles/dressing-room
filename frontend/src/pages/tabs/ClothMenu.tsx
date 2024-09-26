// @ts-nocheck
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AlertComponent } from "../../common/AlertComponent.tsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../utils/constants/colors";

export default function ClothMenu() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [file, setFile] = useState("");
  const [cloths, setCloths] = useState([]);
  const [alertDetails, setAlertDetails] = useState({
    alert_topic: "",
    alert_message: "",
    is_success: false,
  });
  const [percentage, setPercentage] = useState(null);
  const [clothDetails, setClothDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    image: "",
  });

  useEffect(() => {
    if (isAlertOpen) {
      const timer = setTimeout(() => {
        setIsAlertOpen(false);
        setAlertDetails({
          alert_topic: "",
          alert_message: "",
          is_success: false,
        }); //resetting alert details
      }, 2000);
      return () => clearTimeout(timer); // close alert after 2sec
    }
  }, [isAlertOpen]);

  const fetchCloths = async () => {
    const cloth_list = [];
    try {
      const querySnapshot = await getDocs(collection(db, "cloths"));
      querySnapshot.forEach((doc) => {
        cloth_list.push({ id: doc.id, ...doc.data() });
      });
      setCloths(cloth_list);
    } catch (error) {
      console.error("Error fetching cloths: ", error);
    }
  };
  // Fetch Cloths from Firestore
  useEffect(() => {
    fetchCloths();
  }, []);

  // Handle OnChange Input
  const handleOnChangeSubmit = (e) => {
    setClothDetails({ ...clothDetails, [e.target.name]: e.target.value });
  };

  // Upload Image to Firebase Storage
  useEffect(() => {
    const uploadImage = () => {
      const file_name = "cloths_" + new Date().getTime() + "_" + file.name;
      const storageRef = ref(storage, file_name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setClothDetails({ ...clothDetails, image: downloadURL });
          });
        }
      );
    };
    file && uploadImage();
  }, [file]);

  // Add Cloth to Firestore
  const handleClothSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cloths"), clothDetails);

      setAlertDetails({
        alert_topic: "Clothes",
        is_success: true,
        alert_message: "Cloth added successfully!",
      });
      setIsAlertOpen(true);
      fetchCloths();
    } catch (error) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error adding a new cloth. Retry.: " + error,
      });
      setIsAlertOpen(true);
    }
  };

  //removing a dress
  const handleDeleteCloth = async (id) => {
    try {
      await deleteDoc(doc(db, "cloths", id));
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
        alert_message: "Error while removing cloth! Error: " + error,
      });
      setIsAlertOpen(true);
    }
  };

  // Update Cloth in Firestore
  const handleUpdateCloth = async (id, updatedDetails) => {
    try {
      const clothRef = doc(db, "cloths", id);
      await updateDoc(clothRef, updatedDetails);

      setAlertDetails({
        alert_topic: "Clothes",
        is_success: true,
        alert_message: "Cloth updated successfully!",
      });
      setIsAlertOpen(true);
      fetchCloths(); // Refresh the list to reflect updates
    } catch (error) {
      console.log(error);
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error updating cloth. Retry.",
      });
      setIsAlertOpen(true);
    }
  };

  return (
    <Card className=" w-full h-screen border-2 border-gray-800">
      <AlertComponent
        isOpen={isAlertOpen}
        topic={alertDetails.alert_topic || "Clothes"}
        is_success={alertDetails.is_success || false}
        alert_message={alertDetails.alert_message || ""}
      />
      <div className="bg-gray-800 p-1 rounded-t-lg">
        <Typography color="white" className="text-center uppercase">
          Cloth Section
        </Typography>
      </div>
      <div className="mt-2 flex justify-end p-2">
        <Popover placement="bottom-start">
          <PopoverHandler>
            <Button className="flex items-center gap-2" style={{backgroundColor: COLORS.ACCENT}}>
              <FontAwesomeIcon icon={faPlus}/>
              <Typography className="text-xs">Add New Cloth</Typography>
            </Button>
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
                  type="file"
                  label="Upload Image"
                  name="image"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {percentage !== undefined && percentage !== null && (
                  <span className="text-center text-green-500">
                    {percentage < 100
                      ? `Uploading file ${percentage}% completed...`
                      : "Upload finished!"}
                  </span>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" type="button">
                    Cancel
                  </Button>
                  <Button
                    disabled={percentage !== null && percentage < 100}
                    size="sm"
                    type="submit"
                    color="red"
                  >
                    Add Cloth
                  </Button>
                </div>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full p-2">
        <table className="w-full border-2 border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-white ">
              <th className="p-2"></th>
              <th className="p-2 text-start">Cloth Name</th>
              <th className="p-2 text-start">Cloth Type</th>
              <th className="p-2 text-start">Brand</th>
              <th className="p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cloths.map((cloth, index) => (
              <tr key={index}>
                <td className="p-2">
                  <Avatar
                    size="sm"
                    className="border-2 border-gray-800"
                    src={cloth.image}
                  />
                </td>
                <td className="p-2">{cloth.clothName}</td>
                <td className="p-2">{cloth.clothType}</td>
                <td className="p-2">{cloth.brand}</td>
                <td className="p-2 grid grid-cols-3 gap-2">
                  <Popover
                    placement="bottom-start"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <PopoverHandler>
                      <Button variant="outlined" size="sm" color="blue">
                        Update
                      </Button>
                    </PopoverHandler>
                    <PopoverContent className=" ">
                      <Typography
                        className="text-center"
                        color="blue-gray"
                        variant="h6"
                      >
                        Update Cloth
                      </Typography>
                      <form
                        className="grid grid-rows-4 gap-3 p-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdateCloth(cloth.id, clothDetails);
                        }}
                      >
                        <Input
                          label="Cloth Name"
                          name="clothName"
                          defaultValue={cloth.clothName}
                          onChange={(e) =>
                            setClothDetails({
                              ...clothDetails,
                              clothName: e.target.value,
                            })
                          }
                        />
                        <Select
                          name="clothType"
                          label="Cloth Type"
                          defaultValue={cloth.clothType}
                          onChange={(value) =>
                            setClothDetails({
                              ...clothDetails,
                              clothType: value,
                            })
                          }
                        >
                          <Option value="shirt">Shirt</Option>
                          <Option value="pants">Pants</Option>
                          <Option value="shoes">Shoes</Option>
                          <Option value="flock">Flock</Option>
                        </Select>
                        <Input
                          label="Brand"
                          defaultValue={cloth.brand}
                          name="brand"
                          onChange={(e) =>
                            setClothDetails({
                              ...clothDetails,
                              brand: e.target.value,
                            })
                          }
                        />

                        <Button size="sm" type="submit" color="blue">
                          Update Cloth
                        </Button>
                      </form>
                    </PopoverContent>
                  </Popover>

                  <Popover
                    placement="bottom-start"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <PopoverHandler>
                      <Button variant="outlined" size="sm" color="red">
                        Remove
                      </Button>
                    </PopoverHandler>
                    <PopoverContent className="border-2 border-gray-900 bg-gray-800">
                      <div className="gap-2 grid grid-rows-2 ">
                        <Typography className="" variant="h6" color="white">
                          Want to remove this dress?
                        </Typography>
                        <Button
                          onClick={() => handleDeleteCloth(cloth.id)}
                          variant="filled"
                          size="sm"
                          color="red"
                        >
                          Remove
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover
                    placement="bottom-start"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <PopoverHandler>
                      <Button variant="outlined" size="sm" color="green">
                        View
                      </Button>
                    </PopoverHandler>
                    <PopoverContent>
                      <Card className="border-2 border-gray-800 ">
                        <div className="flex gap-4 bg-gray-800 rounded-t-lg p-2">
                          <div className="">
                            <Typography
                              className="-mb-2 "
                              color="white"
                              variant="h4"
                            >
                              {cloth.clothName}
                            </Typography>
                            <Typography color="white" variant="paragraph">
                              {cloth.clothType}
                            </Typography>
                          </div>
                        </div>
                        <div className="p-2">
                          <img src={cloth.image} alt="cloth" className="h-52" />
                        </div>
                      </Card>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
