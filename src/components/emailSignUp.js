import { useState } from "react";
import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const EmailSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);

  const signIn = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      console.log("User created successfully!");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <p>Please {isSignup ? "Create an Account" : "Log In"} to continue.</p>
        <input
          type="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
