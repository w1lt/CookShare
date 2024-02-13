import { useState } from "react";
import { auth, db } from "../config/firebase";
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

export const EmailSignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true);

  const signIn = async (e) => {
    e.preventDefault();
    if (isSignup) {
      const validUsername = await checkValidUsername(username);
      if (validUsername) {
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (userCredential) => {
            await setDoc(doc(db, "users", userCredential.user.uid), {
              username: username,
              email: email,
              userId: userCredential.user.uid,
              followers: [],
              following: [],
            });
            updateProfile(userCredential.user, {
              displayName: username,
            });
          }
        );
      }
    } else {
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

        await signInWithEmailAndPassword(auth, LoginEmail, password);
      }
    }
  };

  return (
    <div>
      <form onSubmit={signIn}>
        <p>Please {isSignup ? "Create an Account" : "Log In"} to continue.</p>
        <div>
          <input
            type="text"
            placeholder={isSignup ? "Username" : "Username or Email"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {isSignup && (
          <div>
            <input
              type="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
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
            disabled={
              !password ||
              !username ||
              password.length < 6 ||
              username.length < 3
            }
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
