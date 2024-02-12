import { auth } from "../config/firebase";
export const Username = () => {
  return <>{auth.currentUser ? auth.currentUser.email : "Guest"}</>;
};
