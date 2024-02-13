import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { useState, useContext } from "react";
import { LogoutButton } from "./logoutButton";
import { UserContext } from "../App";
import { checkValidUsername } from "./username";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { sendEmailVerification } from "firebase/auth";

export const Settings = () => {
  const currentUser = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");
  const [signUpDate, setSignUpDate] = useState("");

  const deleteUser = async () => {
    try {
      const uid = currentUser.uid;
      const user = currentUser.displayName;
      if (window.confirm("Are you sure you want to delete your account?")) {
        await auth.currentUser.delete();
        await deleteDoc(doc(db, "users", uid));
        alert(user + "account deleted successfully!");
      }
    } catch (error) {
      alert("Error deleting account: please log out and log back in");
      console.error("Error deleting user:", error);
    }
  };
  const addDisplayName = async (e) => {
    e.preventDefault();
    try {
      if (await checkValidUsername(displayName)) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        await setDoc(doc(db, "users", currentUser.uid), {
          username: displayName,
        });
      }
      setDisplayName("");
    } catch (error) {}
  };

  const getsetSignUpDate = async () => {
    try {
      let date = await currentUser.metadata.creationTime;
      date = date.split(" ");
      date = date[2] + " " + date[1] + ", " + date[3];
      setSignUpDate(date);
    } catch (error) {
      console.error("Error getting signup date:", error);
    }
  };
  getsetSignUpDate();

  const verifyEmail = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert("Verification email sent!");
    } catch (error) {
      alert("Error sending verification email:", error);
    }
  };

  return (
    <div>
      <h3>
        Logged in as {currentUser.displayName} ({currentUser.email})
      </h3>
      <p>User since {signUpDate || "unavailable"}</p>
      <div>
        <LogoutButton />
        <button onClick={deleteUser} type="submit">
          Delete Account
        </button>
        <button onClick={verifyEmail} type="submit">
          Verify Email
        </button>
      </div>
      <form onSubmit={addDisplayName}>
        <input
          type="text"
          name="displayName"
          placeholder="New Username"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
        <button
          type="submit"
          disabled={
            !displayName ||
            displayName.includes(" ") ||
            displayName.includes(" ")
          }
          onClick={addDisplayName}
        >
          Update
        </button>
      </form>
    </div>
  );
};
