import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { useState, useContext } from "react";
import { LogoutButton } from "./logoutButton";
import { UserContext } from "../App";
import { checkValidUsername } from "./username";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export const Settings = () => {
  const currentUser = useContext(UserContext);
  const [displayName, setDisplayName] = useState(currentUser.displayName);

  const deleteUser = async () => {
    try {
      const user = auth.currentUser.displayName;
      await auth.currentUser.delete();
      alert(user + "account deleted successfully!");
    } catch (error) {
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

  return (
    <div>
      <h3>
        Logged in as {currentUser.displayName} ({currentUser.email})
        <div>
          <LogoutButton />
          <button onClick={deleteUser} type="submit">
            Delete Account
          </button>
        </div>
      </h3>
      <form onSubmit={addDisplayName}>
        <input
          type="text"
          name="displayName"
          placeholder="Username"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
        <div>
          <button
            type="submit"
            disabled={
              !displayName ||
              displayName.includes(" ") ||
              displayName.includes(" ")
            }
            onClick={addDisplayName}
          >
            Update Username
          </button>
        </div>
      </form>
    </div>
  );
};
