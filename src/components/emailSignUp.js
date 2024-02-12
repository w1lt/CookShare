import { useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { checkValidUsername } from "./username";

export const EmailSignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const validUsername = await checkValidUsername(username);
        if (validUsername) {
          await createUserWithEmailAndPassword(auth, email, password).then(
            async (userCredential) => {
              await setDoc(doc(db, "users", userCredential.user.uid), {
                username: username,
              });
              updateProfile(userCredential.user, {
                displayName: username,
              });
            }
          );
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <p>Please {isSignup ? "Create an Account" : "Log In"} to continue.</p>
        {isSignup && (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        <div>
          <input
            type="Email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={signIn}
            type="submit"
            disabled={!email.includes("@") || !email.includes(".") || !password}
          >
            {isSignup ? "Create Account" : "Log In"}
          </button>
        </div>
      </form>
      <span
        onClick={() => setIsSignup(!isSignup)}
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "blue",
        }}
      >
        {isSignup ? "Log In" : "Create Account"}
      </span>{" "}
      instead
    </div>
  );
};
