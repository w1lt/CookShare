import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import { checkValidUsername } from "./username";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import DarkModeToggle from "./darkModeToggle";

export const Settings = () => {
  const currentUser = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");

  const signOutUser = async () => {
    try {
      if (window.confirm("Are you sure you want to log out?")) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error signing out user:", error);
    }
  };
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
        await updateDoc(doc(db, "users", currentUser.uid), {
          username: displayName,
        });
      }
      setDisplayName("");
    } catch (error) {
      alert("Error updating display name:", error.message);
    }
    window.location.reload();
  };

  const verifyEmail = async () => {
    try {
      await sendEmailVerification(currentUser);
      alert("Verification email sent!");
    } catch (error) {
      alert("Error sending verification email:", error);
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        component="div"
        sx={{
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {currentUser.displayName}
      </Typography>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <Typography variant="p" component="h4">
          ({currentUser.email})
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Button variant="outlined" onClick={verifyEmail}>
            Verify Email
          </Button>
          <Button variant="outlined" onClick={deleteUser}>
            Delete Account
          </Button>
          <Button variant="outlined" onClick={signOutUser}>
            Logout
          </Button>
          <DarkModeToggle />
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            <TextField
              type="text"
              fullWidth
              placeholder={currentUser.displayName || "Display Name"}
              label="New Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addDisplayName(e);
                }
              }}
            />
            <Button variant="outlined" onClick={addDisplayName}>
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};
