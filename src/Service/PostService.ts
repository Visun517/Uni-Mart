import { auth, db } from "../Config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const PostSave = async (
  title: string,
  price: number,
  category: string,
  desc: string,
  imageUrl: string,
  number: string
) => {
  try {
    console.log("Post Saving:", title, price);
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // 2. "posts" collection එකට දත්ත ඇතුළත් කිරීම
    const docRef = await addDoc(collection(db, "posts"), {
      title: title,
      price: price,
      category: category,
      desc: desc,
      number: number,
      imageUrl: imageUrl,
      sellerId: user.uid,
      sellerEmail: user.email,
      createdAt: serverTimestamp(),
      status: "available"
    });

    console.log("Post saved with ID: ", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};