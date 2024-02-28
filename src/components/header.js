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
        <Typography
          variant="h3"
          component="div"
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CookShare
        </Typography>
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
        <Container sx={{ paddingTop: 2, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 1,
              paddingBottom: 1,
            }}
          >
            <Link
              to="/home"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography
                variant="h3"
                component="div"
                sx={{
                  background:
                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CookShare
              </Typography>
            </Link>
          </Box>

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
