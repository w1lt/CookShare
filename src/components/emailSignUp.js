import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { Link, useParams } from "react-router-dom";
import {
  doc,
  setDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { checkValidUsername } from "./username";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { GoogleSignIn } from "./googleSignIn";

export const EmailSignUp = () => {
  const { loginType } = useParams();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(loginType);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  document.title = isSignup ? "Cookshare | Sign Up" : "Cookshare | Log In";

  useEffect(() => {
    if (loginType === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [loginType, isSignup]);

  const signIn = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (isSignup) {
      const validUsername = await checkValidUsername(username);
      if (validUsername) {
        console.log("loading...");
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (userCredential) => {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              username: username,
              email: email,
              userId: userCredential.user.uid,
              followers: [],
              following: [],
            }); // Create a new user document in Firestore
            await updateProfile(userCredential.user, {
              displayName: username,
            }); // Set the user's display name to their username
            setIsLoading(false);
          }
        );
      }
    } else {
      try {
        if (username.includes("@")) {
          await signInWithEmailAndPassword(auth, username, password);
        } else {
          let LoginEmail;
          const q = query(
            collection(db, "users"),
            where("username", "==", username)
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            LoginEmail = doc.data().email;
          });
          if (!LoginEmail) {
            throw new Error("Wrong username / email");
          }

          await signInWithEmailAndPassword(auth, LoginEmail, password);
        }
      } catch (error) {
        if (error.message === "auth/user-not-found") {
          setError("User not found");
        }
        setError(error.message);
        console.log(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          textAlign="center"
          color="text.primary"
        >
          Cookshare 👨‍🍳
        </Typography>
        <Typography
          component="p"
          variant="p"
          textAlign="center"
          color="text.primary"
        >
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>
        <Box
          component="form"
          onSubmit={signIn}
          noValidate
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            max-width="50%"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setError(null)}
            size="large"
            variant="outlined"
            label={isSignup ? "Username" : "Username or Email"}
            autoFocus
          />

          {isSignup && (
            <TextField
              fullWidth
              type="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setError(null)}
              size="large"
              variant="outlined"
              label="Email"
            />
          )}

          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setError(null)}
            size="large"
            variant="outlined"
            label="Password"
          />
          {isloading ? (
            <LinearProgress />
          ) : (
            <Button
              variant="contained"
              onClick={signIn}
              type="submit"
              color={error ? "error" : "primary"}
              disabled={
                !password ||
                !username ||
                password.length < 6 ||
                username.length < 3
              }
            >
              {error ? error : "Log In"}
            </Button>
          )}
        </Box>
        <Grid container>
          <Grid item>
            {isSignup ? "Have an account? " : "Don't have an account? "}
            <Link
              onClick={() => {
                setError(null);
              }}
              to={isSignup ? "/auth/login" : "/auth/signup"}
            >
              {isSignup ? "Log In" : "Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
      <GoogleSignIn />
    </>
  );
};
