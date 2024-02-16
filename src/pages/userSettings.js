import { Navigate } from "react-router-dom";
import { Settings } from "../components/settings";
import { UserContext } from "../App";
import { useContext, useEffect } from "react";

export const UserSettings = () => {
  useEffect(() => {
    document.title = "CS | Settings";
  }, []);
  const currentUser = useContext(UserContext);
  return <>{currentUser ? <Settings /> : <Navigate to={"/auth/login"} />}</>;
};
