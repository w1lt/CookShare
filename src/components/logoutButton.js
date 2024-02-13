import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export const LogoutButton = () => {
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out user:", error);
    }
  };
  return (
    <>
      <button onClick={signOutUser}>Log Out</button>
    </>
  );
};
