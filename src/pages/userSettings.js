import { Navigate } from "react-router-dom";
import { Settings } from "../components/settings";
import { UserContext } from "../App";
import { useContext } from "react";

export const UserSettings = () => {
  const currentUser = useContext(UserContext);
  return <>{currentUser ? <Settings /> : <Navigate to={"/login"} />}</>;
};
