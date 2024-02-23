import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { Link, useParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { GoogleSignIn } from "./googleSignIn";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { lightBlue } from "@mui/material/colors";

export const EmailSignUp = () => {
  const { loginType } = useParams();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(loginType);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  document.title = isSignup ? "Cookshare | Sign Up" : "Cookshare | Log In";

  useEffect(() => {
    if (loginType === "signup") {
      setIsSignup(true);
    } else {
      setIsSignup(false);
    }
  }, [loginType, isSignup]);

  const signIn = async (e) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    if (isSignup) {
      const validUsername = await checkValidUsername(username);
      if (validUsername) {
        console.log("loading...");
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (userCredential) => {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              username: username,
              userId: userCredential.user.uid,
              followers: [],
              following: [],
            });
            await updateProfile(userCredential.user, {
              displayName: username,
            });
            setIsLoading(false);
          }
        );
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsLoading(false);
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
            fullWidth
            type="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setError(null)}
            size="large"
            variant="outlined"
            label="Email"
            placeholder="Email"
          />

          {isSignup && (
            <TextField
              max-width="50%"
              autoCapitalize="off"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setError(null)}
              size="large"
              variant="outlined"
              label="Username"
              placeholder="Username"
              autoFocus
            />
          )}

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setError(null)}
            size="large"
            variant="outlined"
            label="Password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isloading ? (
            <LinearProgress />
          ) : (
            <Button
              style={{ textTransform: "none" }}
              variant="contained"
              onClick={signIn}
              type="submit"
              sx={{
                opacity: password.length < 6 || !username ? 0.65 : 1,
              }}
              color={error ? "error" : "primary"}
            >
              {isSignup ? "Sign up" : "Log in"}
            </Button>
          )}
        </Box>
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Grid item>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Grid>

          <Grid item>
            {isSignup ? "Have an account? " : "Don't have an account? "}
            <Link
              style={{
                textDecoration: "none",
                color: lightBlue[500],
                cursor: "pointer",
              }}
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
