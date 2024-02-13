import { UserContext } from "../App";
import { useContext } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import { db } from "../config/firebase";

export const checkValidUsername = async (username) => {
  username = username.toLowerCase();
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      console.error("Username already taken");
      alert("Username already in use. Please choose another.");
      return false;
    } else {
      console.log("Username is available");
      return true;
    }
  } catch (error) {
    console.error("Error checking username:", error);
  }
};
export const Username = () => {
  const currentUser = useContext(UserContext);

  return (
    <>{currentUser.displayName ? currentUser.displayName : currentUser.email}</>
  );
};
