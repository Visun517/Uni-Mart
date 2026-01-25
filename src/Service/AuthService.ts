import { createUserWithEmailAndPassword, updateProfile,signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../Config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";



export const  login1 = async (
    email: string, 
    password: string
) => {
   return await signInWithEmailAndPassword(auth, email, password);
};


export const registation  = async (
    fullName: string, 
    email: string, 
    password: string
) => {
    console.log("Registering user:", fullName, email);

    const userCredential = await createUserWithEmailAndPassword( 
        auth ,
        email, 
        password
    )
    await updateProfile(await userCredential.user, {
        displayName: fullName
    })
    setDoc(doc(db, "users", userCredential.user.uid), {
        name : fullName,
        role : "",  
        email,
        creatAt : new Date()
    });
    return userCredential;

};

export const logoutUser = async () => {
    await signOut(auth);
    AsyncStorage.clear();
    return;
}

export const loginWithGoogle = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return await signInWithCredential(auth, credential);
};