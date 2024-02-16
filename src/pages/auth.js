import { EmailSignUp } from "../components/emailSignUp";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";
import { Box, Container } from "@mui/material/";

export const Auth = () => {
  const currentUser = useContext(UserContext);

  return (
    <>
      {!currentUser ? (
        <>
          <Container
            component="main"
            maxWidth="xs"
            sx={{
              py: 8,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <EmailSignUp />
          </Container>
        </>
      ) : (
        currentUser &&
        Object.keys(currentUser).length > 0 && <Navigate to="/home" />
      )}
    </>
  );
};
