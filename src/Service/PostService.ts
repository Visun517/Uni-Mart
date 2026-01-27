import { auth, db } from "../Config/firebaseConfig";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, where, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Post from "../types/Post";

// post save
export const PostSave = async (
  title: string,
  price: number,
  category: string,
  desc: string,
  imageUrl: string,
  number: string
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = await addDoc(collection(db, "posts"), {
      title,
      price,
      category,
      desc,
      number,
      imageUrl,
      sellerId: user.uid,
      sellerEmail: user.email,
      createdAt: serverTimestamp(),
      status: "available"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// get all posts
export const GetAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];

    return posts;

  } catch (error) {
    console.error("Error getting all posts: ", error);
    throw error;
  }
};

// get post by user
export const GetUserPosts = async (): Promise<Post[]> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "posts"),
      where("sellerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
  } catch (error) {
    console.error("Error getting user posts: ", error);
    throw error;
  }
};

// post update
export const UpdatePost = async (postId: string, updateData: any) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// post delete
export const DeletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};


export const GetPostById = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, "posts", postId);

    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() } as Post;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting post by ID: ", error);
    throw error;
  }
};