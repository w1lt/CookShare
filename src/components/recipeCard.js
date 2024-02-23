import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import { BASE_DOMAIN } from "../static/vars";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Dialog from "@mui/material/Dialog";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const RecipeCard = (recipe) => {
  const currentUser = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const calcCookTime = (cookTime) => {
    const hours = Math.floor(cookTime / 60);
    const minutes = cookTime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  //resize image using sharp

  const copyRecipeLink = () => {
    const recipeLink = `${BASE_DOMAIN}/recipes/${recipe.id}`;
    navigator.clipboard.writeText(recipeLink);
    setOpen(false);
  };

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        localStorage.setItem(`authorUsername_${uid}`, username);
      }
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const cachedUsername = localStorage.getItem(
      `authorUsername_${recipe.authorUid}`
    );
    if (cachedUsername) {
    } else {
      getUsernameFromUid(recipe.authorUid);
    }
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
  return (
    <>
      <Card
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        sx={{
          width: 225,
          height: 285,
          margin: "1rem",
          transition: "transform 0.5s",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        }}
      >
        <Link
          to={`/recipes/${recipe.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardMedia
            component="img"
            image={recipe.image || <Skeleton variant="rectangular" />}
            sx={{
              height: 140,
              objectFit: "cover",
            }}
          />

          <CardContent>
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
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                <AccessTimeIcon fontSize="1" />
                {calcCookTime(recipe.cookTime)}
                &nbsp;| {recipe.servings || 1}{" "}
                {recipe.servings > 1 ? "servings" : "serving"}
              </Box>
            </Typography>
            <Typography
              variant="body2"
              textOverflow={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {recipe.description}
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
            onClick={handleOpen}
          />

          <Dialog open={open} onClose={() => setOpen(false)}>
            {currentUser.uid === recipe.authorUid && (
              <Button onClick={handleDeleteRecipe}>Delete</Button>
            )}
            <Button onClick={copyRecipeLink}>Copy Link</Button>
          </Dialog>
        </CardActions>
      </Card>
    </>
  );
};
