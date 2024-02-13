import { EmailSignUp } from "./emailSignUp";
import { GoogleSignIn } from "./googleSignIn";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";

export const WelcomePage = () => {
  const currentUser = useContext(UserContext);

  return (
    <div>
      {!currentUser ? (
        <div>
          <h1>Welcome to the Recipe App!</h1>
          <EmailSignUp />
          <GoogleSignIn />
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </div>
  );
};
