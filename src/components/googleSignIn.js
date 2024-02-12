import { signInWithRedirect } from "firebase/auth";
import { auth, googleProvidor } from "../config/firebase";

export const GoogleSignIn = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvidor);
      console.log("User created successfully!");
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
