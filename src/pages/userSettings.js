import { Navigate } from "react-router-dom";
import { Settings } from "../components/settings";
import { auth } from "../config/firebase";
import { useState } from "react";

export const UserSettings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  auth.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
      console.log("User is signed in");
      console.log("User email: " + user.displayName);
    } else {
      setIsLoggedIn(false);
      console.log("User is signed out");
    }
  });

  return <>{isLoggedIn ? <Settings /> : <Navigate to={"/login"} />}</>;
};
