import { useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const EmailSignUp = ({ isSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      console.log("User created successfully!");
    } catch (error) {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        alert("Email already in use. Please sign in.");
      }
      if (error.message === "Firebase: Error (auth/invalid-email).") {
        alert("Invalid email");
      }
      if (error.message === "Firebase: Error (auth/weak-password).") {
        alert("Password must be at least 6 characters long");
      }
      if (error.message === "Firebase: Error (auth/user-not-found).") {
        alert("User not found, try logging in?");
      } else {
        alert("Could not log in", error.message);
      }
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <p>Please {isSignUp ? "Create an Account" : "Log In"} to continue.</p>
        <input
          type="Email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={signIn}
            type="submit"
            disabled={!email.includes("@") || !email.includes(".") || !password}
          >
            {isSignUp ? "Create Account" : "Log In"}
          </button>
        </div>
      </form>
    </div>
  );
};
