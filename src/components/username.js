import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
export const Username = () => {
  const [username, setusername] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setusername(user.email);
      } else {
        setusername("Guest");
      }
    });
  }, []);
  return <>{username ? username : "Guest"}</>;
};
