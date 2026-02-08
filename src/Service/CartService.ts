import { doc, setDoc, getDocs, collection, query, where, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../Config/firebaseConfig";
import Post from "../types/Post";


export const addToCart = async (post: Post) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Please login first");

    const cartId = `${user.uid}_${post.id}`;
    
    await setDoc(doc(db, "carts", cartId), {
      userId: user.uid,
      postId: post.id,
      title: post.title,
      price: post.price,
      imageUrl: post.imageUrl,
      category: post.category,
      addedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const q = query(collection(db, "carts"), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      cartId: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Get cart error:", error);
    return [];
  }
};

export const removeFromCart = async (cartId: string) => {
  await deleteDoc(doc(db, "carts", cartId));
};