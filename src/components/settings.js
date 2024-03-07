import { auth } from "../config/firebase";
import { updateProfile, verifyBeforeUpdateEmail } from "firebase/auth";
import { useState, useContext } from "react";
import { UserContext } from "../App";
import { checkValidUsername } from "./username";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { sendEmailVerification } from "firebase/auth";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import DarkModeToggle from "./darkModeToggle";
import { useTheme } from "@emotion/react";

export const Settings = () => {
  const theme = useTheme();
  const currentUser = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  const signOutUser = async () => {
    try {
      await signOut(auth);
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

  const handleChangeEmail = async (e) => {
    console.log(email);
    e.preventDefault();
    try {
      await verifyBeforeUpdateEmail(currentUser, email).then(() => {
        alert("check inbox!");
      });
    } catch (error) {
      alert("Error updating email:", error.message);
    }
    setEmail("");
  };

  const addDisplayName = async (e) => {
    e.preventDefault();
    if (displayName === "") {
      alert("Please enter a valid display name");
      return;
    }
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
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          alignItems: "center",
          border: 1,
          borderColor: theme.palette.divider,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {currentUser.displayName || <CircularProgress />}
          </Typography>
          <Typography variant="h5" component="div">
            {currentUser.emailVerified ? "✅" : ""}
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: "100%",
          }}
        >
          <Button variant="outlined" onClick={verifyEmail}>
            Verify Email
          </Button>

          <DarkModeToggle />
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            <TextField
              type="text"
              fullWidth
              placeholder={currentUser.displayName || "Display Name"}
              label="Change Username"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addDisplayName(e);
                }
              }}
            />
            <Button
              sx={{
                whiteSpace: "nowrap",
              }}
              variant="outlined"
              onClick={addDisplayName}
            >
              Update
            </Button>
          </Box>
          <Box display={"flex"} flexDirection={"row"} gap={1}>
            <TextField
              type="text"
              label="Change Email"
              placeholder={currentUser.email || "Email"}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChangeEmail(e);
                }
              }}
            ></TextField>
            <Button
              onClick={handleChangeEmail}
              sx={{
                whiteSpace: "nowrap",
              }}
              variant="outlined"
            >
              Update
            </Button>
          </Box>
          <Button variant="outlined" onClick={signOutUser}>
            Log Out
          </Button>
          <Button variant="outlined" color="error" onClick={deleteUser}>
            Delete Account
          </Button>
        </Box>
      </Container>
    </>
  );
};
