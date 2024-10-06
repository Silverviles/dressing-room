// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {
  Avatar,
  Button,
  Card, CardBody, CardFooter, CardHeader, Chip,
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
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AlertComponent } from "../../common/AlertComponent.tsx";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../utils/constants/colors";
import {fetchClothes} from "../../controller/cloth.controller.ts";
import ReportComponent from "../../components/ReportComponent.tsx";

export default function ClothMenu() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isUploadFinished, setUploadFinished] = useState(false);

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

  // Fetch Clothes from Firestore
    useEffect(() => {
        fetchClothes().then((cloths) => {
            setCloths(cloths);
        })
    }, []);

  // Handle OnChange Input
  const handleOnChangeSubmit = (e) => {
    setClothDetails({ ...clothDetails, [e.target.name]: e.target.value });
  };

  // Upload Image to Firebase Storage
  useEffect(() => {
    const uploadImage = () => {
      setUploadFinished(true);
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
            setUploadFinished(false);
          });
        }
      );
    };
    if(file){
      uploadImage();
    }
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
      fetchClothes().then((cloths) => {
        setCloths(cloths);
      });
    } catch (error) {
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error adding a new cloth. Retry.: " + error,
      });
      setIsAlertOpen(true);
    }
  };

  // Remove Cloth from Firestore
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
      fetchClothes().then(
        (cloths) => {
          setCloths(cloths);
        }
      ); // Refresh the list to reflect updates
    } catch (error) {
      console.log(error);
      setAlertDetails({
        alert_topic: "Clothes",
        is_success: false,
        alert_message: "Error updating cloth. Retry. Error: ", error,
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
       <div className={'p-10'} style={{
         backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://img.freepik.com/free-vector/seamless-woman-s-stylish-bags-retro-pattern_98292-4349.jpg?t=st=1728189648~exp=1728193248~hmac=0d99e6a4e1e69f21ef6809d77f215c3d8b02c8972321a74b32058d59ae648b65&w=740')`,
       }} >
         <Typography variant={'h1'}  className="text-center text-white" style={{
              fontFamily: "Abril Fatface",
         }}>
           Cloth Section
         </Typography>
         <div className={'w-11/12 flex items-center justify-center text-center mx-auto'}  >
            <Typography className={'text-center justify-center text-sm text-white'} style={{
                fontFamily: "Abril Fatface",
            }}>
              Welcome to the hub of your virtual fashion collection! Add and manage the clothing items that power our AR Dressing Room. Upload the latest styles, tweak your collection, and remove outdated looks to keep your wardrobe fresh. Keep your collection on-trend and let your users explore fashion like never before!
            </Typography>
        </div>
       </div>
       <div className=" flex justify-end p-2 items-center gap-2 mt-4">
         <ReportComponent reportData={cloths}/>
         <Popover placement="bottom-start">
           <PopoverHandler>
             <Button className="flex items-center gap-2" >
               <FontAwesomeIcon icon={faPlus}/>
               <Typography className="text-xs font-semibold">Add New Cloth</Typography>
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
                        && `Uploading file ${Math.floor(percentage)}% completed...`}
                  </span>
                 )}

                 <div className="grid grid-cols-2 gap-2">
                   <Button size="sm" type="button">
                     Cancel
                   </Button>
                   <Button
                       disabled={isUploadFinished}
                       loading={ isUploadFinished}
                       size="sm"
                       type="submit"
                       color="red"
                   >
                     {isUploadFinished ? "Uploading..." : "Add Cloth"}
                   </Button>
                 </div>
               </form>
             </div>
           </PopoverContent>
         </Popover>
       </div>

       <div className={'w-screen grid grid-cols-3 p-4'}>
         {cloths.map((cloth, index) => (
            <div className={'mb-4'}>
              <Card key={index} className={'w-96 h-full p-4'}>
                <Chip color={'yellow'} className={'absolute top-2 right-2 z-20'} value={cloth.clothType}></Chip>
                <img className={'h-96'} alt={cloth.image} src={cloth.image}/>
                <CardBody>
                  <Typography className="text-center font-semibold text-gray-900 text-2xl" style={{
                    fontFamily: "Abril Fatface",
                  }}>
                    {cloth.clothName}
                  </Typography>
                  <Typography className="text-center text-gray-900 mb-2" style={{
                    fontFamily: "Abril Fatface",
                  }}>
                    {cloth.brand}
                  </Typography>
                </CardBody>

                <div className={'grid grid-cols-2 gap-2 -mt-6'}>
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
                        <input className={'w-0 h-0'} name={'image'} value={cloth.image} hidden/>
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
                </div>

              </Card>
            </div>
         )
         )}
       </div>
     </div>
   </div>
  );
}
