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
  Divider,
} from "@mui/material";
import { SocialAuth } from "./socialAuth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { lightBlue } from "@mui/material/colors";
import { useTheme } from "@emotion/react";

export const EmailSignUp = () => {
  const theme = useTheme();
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
  }, [loginType]);

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
          padding: 3,
          border: 1,
          borderColor: theme.palette.divider,
          borderRadius: 1,
        }}
      >
        <Typography
          variant="h3"
          component="div"
          sx={{
            alignSelf: "center",
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            paddingBottom: 2,
          }}
        >
          CookShare
        </Typography>

        <Box
          component="form"
          onSubmit={signIn}
          noValidate
          sx={{
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <TextField
            autoFocus
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
              style={{ textTransform: "none", fontWeight: "bold" }}
              variant="contained"
              onClick={password.length < 6 || !email ? null : signIn}
              type="submit"
              sx={{
                opacity: password.length < 6 || !email ? 0.6 : 1,
                cursor:
                  password.length < 6 || !email ? "not-allowed" : "pointer",
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
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            padding: 2,
          }}
        >
          <Divider
            sx={{
              width: "40%",
            }}
          />
          OR{" "}
          <Divider
            sx={{
              width: "40%",
            }}
          />
        </Box>
        <SocialAuth providor="Github" loginType={loginType} />
        <SocialAuth providor="Google" loginType={loginType} />
        <Grid
          fullWidth
          sx={{
            alignSelf: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {isSignup ? (
            <Typography
              variant="body2"
              color={"textSecondary"}
              sx={{
                padding: 2,
              }}
            >
              By signing up for an account you agree to CookShare's{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: lightBlue[500],
                  cursor: "pointer",
                }}
              >
                terms of service.
              </Link>
            </Typography>
          ) : null}
          <Typography
            variant="body1"
            color={"textSecondary"}
            sx={{
              padding: 1,
            }}
          >
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
          </Typography>
        </Grid>
      </Box>
    </>
  );
};
