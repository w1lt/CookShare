import { auth } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import { checkValidUsername } from "./username";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { signOut } from "firebase/auth";

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
        await setDoc(doc(db, "users", currentUser.uid), {
          username: displayName,
        });
      }
      setDisplayName("");
      alert("Display name updated successfully!");
    } catch (error) {
      alert("Error updating display name:", error.message);
    }
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
        <Typography variant="h4" component="h1">
          {currentUser.displayName}
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
          <Button variant="contained" onClick={verifyEmail}>
            Verify Email
          </Button>
          <Button variant="contained" onClick={deleteUser}>
            Delete Account
          </Button>
          <Button variant="contained" onClick={signOutUser}>
            Logout
          </Button>
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            <TextField
              fullWidth
              placeholder={currentUser.displayName || "Display Name"}
              label="New Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <Button variant="contained" onClick={addDisplayName}>
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};
