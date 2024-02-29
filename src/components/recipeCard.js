import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import { BASE_DOMAIN } from "../static/vars";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const RecipeCard = (recipe) => {
  const currentUser = useContext(UserContext);
  const [showLikedAlert, setShowLikedAlert] = useState(false);
  const [authorUsername, setAuthorUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const calcCookTime = (cookTime) => {
    const hours = Math.floor(cookTime / 60);
    const minutes = cookTime % 60;
    if (hours >= 1) {
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    } else {
      return `${minutes}m`;
    }
  };

  const copyRecipeLink = () => {
    const recipeLink = `${BASE_DOMAIN}/recipes/${recipe.id}`;
    navigator.clipboard.writeText(recipeLink);
    handleClose();
  };

  useEffect(() => {
    setFadeIn(true);
    const getUsernameFromUid = async (uid) => {
      await getDoc(doc(db, "users", uid)).then((docSnap) => {
        if (docSnap.exists()) {
          const username = docSnap.data().username;
          localStorage.setItem(`authorUsername_${uid}`, username);
          setAuthorUsername(username);
        }
      });
    };
    getUsernameFromUid(recipe.authorUid);
  }, [recipe.authorUid]);

  const handleLikeRecipe = async () => {
    try {
      if (recipe.usersLiked.includes(currentUser.uid)) {
        await updateDoc(doc(db, "recipes", recipe.id), {
          usersLiked: recipe.usersLiked.filter(
            (user) => user !== currentUser.uid
          ),
        });
      } else {
        await updateDoc(doc(db, "recipes", recipe.id), {
          usersLiked: [...recipe.usersLiked, currentUser.uid],
        });
        setShowLikedAlert(true);
        setTimeout(() => {
          setShowLikedAlert(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      await deleteDoc(doc(db, "recipes", recipe.id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  return !authorUsername ? (
    <Skeleton
      variant="rounded"
      width={225}
      height={285}
      sx={{
        margin: "1rem",
      }}
    />
  ) : (
    <>
      <Snackbar open={showLikedAlert} autoHideDuration={3000}>
        <Alert severity="success" sx={{ width: 300, margin: "auto" }}>
          Recipe saved
        </Alert>
      </Snackbar>
      <Card
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        sx={{
          width: 225,
          height: 270,
          margin: "1rem",
          transition: "transform 0.5s ",
          opacity: fadeIn ? 1 : 0,
        }}
      >
        <Link
          to={`/recipes/${recipe.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardMedia
            component="img"
            image={
              recipe.image ||
              "https://www.mimisrecipes.com/wp-content/uploads/2018/12/recipe-placeholder-featured.jpg"
            }
            alt={recipe.name}
            sx={{
              height: 140,
              objectFit: "cover",
            }}
          />

          <CardContent
            style={{
              padding: "14px",
            }}
          >
            <Typography
              variant="body2"
              textOverflow={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {recipe.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textOverflow={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.1,
                }}
              >
                <AccessTimeIcon fontSize="1" />
                {calcCookTime(recipe.cookTime)}
                &nbsp;|&nbsp;
                {recipe.servings || 1}{" "}
                {recipe.servings > 1 ? "servings" : "serving"}
              </Box>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textOverflow={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              By: {authorUsername || "Loading..."}
            </Typography>
          </CardContent>
        </Link>
        <CardActions display="flex" justifyContent="space-between">
          {recipe.usersLiked.includes(currentUser.uid) ? (
            <BookmarkIcon
              cursor="pointer"
              onClick={() => handleLikeRecipe()}
              color="primary"
            />
          ) : (
            <BookmarkBorderIcon
              onClick={() => handleLikeRecipe()}
              cursor="pointer"
            />
          )}
          {recipe.usersLiked.length}
          <MoreHorizIcon
            style={{ marginLeft: "auto" }}
            cursor="pointer"
            onClick={handleClick}
          />

          <Menu anchorEl={anchorEl} open={Boolean(open)} onClose={handleClose}>
            <MenuItem onClick={copyRecipeLink}>Copy Link</MenuItem>
            {currentUser.uid === recipe.authorUid && (
              <MenuItem onClick={handleDeleteRecipe}>Delete</MenuItem>
            )}
          </Menu>
        </CardActions>
      </Card>
    </>
  );
};
