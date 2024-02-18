import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
export const Header = () => {
  const [currentPage, setCurrentPage] = useState("auth");
  const currentUser = useContext(UserContext);

  useEffect(() => {
    if (window.location.pathname.includes("/auth")) {
      setCurrentPage("auth");
    }
  }, []);

  if (!currentUser && currentPage !== "auth") {
    return (
      <div>
        <h1>Recipe App! 👨‍🍳</h1>
        <Link
          onClick={() => {
            setCurrentPage("auth");
          }}
          to="/auth/login"
        >
          Login
        </Link>{" "}
        |{" "}
        <Link
          onClick={() => {
            setCurrentPage("auth");
          }}
          to="/auth/signup"
        >
          Sign Up
        </Link>
      </div>
    );
  } else if (currentUser) {
    return (
      <>
        <Container sx={{ paddingTop: 2 }}>
          <Typography variant="h4" component="div">
            Cookshare 🍳
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1,
              borderBottom: 1,
              borderColor: "divider",
              paddingBottom: 1,
            }}
          >
            <Button
              style={{ textTransform: "none" }}
              component={Link}
              to={"/home"}
            >
              Home
            </Button>
            <Button
              style={{ textTransform: "none" }}
              component={Link}
              to={"/new-recipe"}
            >
              Create Recipe
            </Button>
            <Button
              style={{ textTransform: "none" }}
              component={Link}
              to={`/profile/${currentUser.displayName}`}
            >
              Profile
            </Button>
            <Button
              style={{ textTransform: "none" }}
              component={Link}
              to={"/settings"}
            >
              Settings
            </Button>
          </Box>
        </Container>
      </>
    );
  }
};
