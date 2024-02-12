import { EmailSignUp } from "./emailSignUp";
import { GoogleSignIn } from "./googleSignIn";
import { useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

export const WelcomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });
  return (
    <div>
      {!isLoggedIn ? (
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
