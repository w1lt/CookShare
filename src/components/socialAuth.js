import { signInWithPopup } from "firebase/auth";
import { auth, googleProvidor, githubProvidor } from "../config/firebase";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

export const SocialAuth = (providor) => {
  console.log("providor:", providor.providor);

  const signIn = async () => {
    try {
      if (providor.providor === "Google") {
        await signInWithPopup(auth, googleProvidor);
      } else {
        await signInWithPopup(auth, githubProvidor);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={signIn}
        type="submit"
        style={{ textTransform: "none" }}
      >
        {providor.providor === "Google" ? <GoogleIcon /> : <GitHubIcon />}
        &nbsp;
        {providor.loginType === "signup"
          ? "Sign Up with "
          : "Log In with "}{" "}
        {providor.providor}
      </Button>
    </>
  );
};
