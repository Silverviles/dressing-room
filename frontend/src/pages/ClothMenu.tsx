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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ClothMenu() {
  const [file, setFile] = useState("");
  const [cloths, setCloths] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [clothDetails, setClothDetails] = useState({
    clothName: "",
    clothType: "",
    brand: "",
    image: "",
  });

  // Fetch Cloths from Firestore
  useEffect(() => {
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

    fetchCloths();
  }, []);

  console.log("cloths: ", cloths);

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
  console.log("clothDetails: ", clothDetails);

  // Add Cloth to Firestore
  const handleClothSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "cloths"), clothDetails);
      console.log("Cloth added successfully!");
    } catch (error) {
      console.error("Error adding cloth: ", error);
    }
  };

  const handleDeleteCloth = async (id) => {
    try {
      await deleteDoc(doc(db, "cloths", id));
      setCloths(cloths.filter((cloth) => cloth.id !== id));
    } catch (error) {
      console.error("Error deleting cloth: ", error);
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

      <div className="grid grid-cols-3 gap-2 p-2 ">
        {cloths.map((cloth, index) => (
          <Card className="border-2 border-gray-800 h-52">
            <div className="flex gap-4 bg-gray-800 rounded-t-lg p-2">
              <Avatar
                size="lg"
                className="border-2 border-gray-800"
                src={cloth.image}
              />

              <div>
                <Typography className="-mb-2" color="white" variant="h4">
                  {cloth.clothName}
                </Typography>
                <Typography color="white" variant="paragraph">
                  {cloth.clothType}
                </Typography>
              </div>
            </div>
            <div className="p-2">
              <Typography>{cloth.brand}</Typography>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2">
              <Button variant="outlined" size="sm" color="blue">
                Update
              </Button>
              <Button
                onClick={() => handleDeleteCloth(cloth.id)}
                variant="outlined"
                size="sm"
                color="red"
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
