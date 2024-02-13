import { signInWithPopup } from "firebase/auth";
import { auth, googleProvidor } from "../config/firebase";

export const GoogleSignIn = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvidor);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle} type="submit">
        Sign in with Google
      </button>
    </div>
  );
};
