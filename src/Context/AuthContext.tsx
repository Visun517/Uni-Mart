import { Children, createContext, use, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/Config/firebaseConfig";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
});

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
  const { showLoader, hideLoader, isLoading } = useLoader();
  const [user, setUser] = useState<User | null>(null);
  console.log("============================================================r")

  useEffect(() => {
    showLoader();
    console.log("hello------------------------")

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('vv')
      console.log(user)
      setUser(user);
      hideLoader();
    })

    // Cleanup subscription on unmount ( cleanup function )
    return () => unsubscribe()
      // {
      // console.log('unmount')
      // unsubscribe();
    // }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};