import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { LogoutButton } from "./logoutButton";

export const Settings = () => {
  const [displayName, setDisplayName] = useState("");

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
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setDisplayName("");
    } catch (error) {}
  };

  const generateDisplayName = () => {
    const email = auth.currentUser.email;
    const displayName = email.substring(0, email.indexOf("@"));
    return displayName;
  };

  if (auth.currentUser.displayName === null) {
    const displayName = generateDisplayName();
    updateProfile(auth.currentUser, {
      displayName: displayName,
    });
  }

  return (
    <div>
      <h3>
        Logged in as {auth.currentUser.displayName || generateDisplayName()} (
        {auth.currentUser.email})
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
            {displayName == null ? "Create" : "Update"} display name
          </button>
        </div>
      </form>
    </div>
  );
};
