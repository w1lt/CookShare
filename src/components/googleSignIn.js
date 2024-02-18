import { signInWithPopup } from "firebase/auth";
import { auth, googleProvidor } from "../config/firebase";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const GoogleSignIn = () => {
  const { loginType } = useParams();
  const [isSignup, setIsSignup] = useState(loginType);

  useEffect(() => {
    if (loginType === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [loginType, isSignup]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvidor);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}
        type="submit"
        style={{ textTransform: "none" }}
      >
        <GoogleIcon /> &nbsp;{" "}
        {isSignup ? "Sign Up with Google" : "Log In with Google"}
      </Button>
    </>
  );
};
