import { EmailSignUp } from "./emailSignUp";
import { GoogleSignIn } from "./googleSignIn";
import { useState } from "react";

export const WelcomePage = () => {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div>
      {<EmailSignUp isSignUp={isSignup} />}
      <p>
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
      </p>
      <GoogleSignIn />
    </div>
  );
};
