import {collection, DocumentData, getDocs} from "firebase/firestore";
import {db} from "../utils/firebase";

export const fetchClothes = async () => {
    const clothes: DocumentData[] = [];

    try{
        const querySnapshot = await getDocs(collection(db, "cloths"));
        querySnapshot.forEach((doc) => {
            clothes.push({id: doc.id, ...doc.data()});
        });

        console.log("Clothes fetched successfully", clothes);

        return clothes;
    }catch (error) {
        console.error("Error fetching clothes", error);
    }

}