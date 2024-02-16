import { UserContext } from "../App";
import { useContext, useEffect } from "react";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_DOMAIN } from "../static/vars";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export const Recipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");

  const copyRecipeLink = () => {
    const recipeLink = `${BASE_DOMAIN}/recipes/${recipe.id}`;
    navigator.clipboard.writeText(recipeLink);
  };

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        setAuthorUsername(username);
        // Store the username in localStorage
        localStorage.setItem(`authorUsername_${uid}`, username);
      }
    });
  };

  useEffect(() => {
    const cachedUsername = localStorage.getItem(
      `authorUsername_${recipe.authorUid}`
    );
    if (cachedUsername) {
      setAuthorUsername(cachedUsername);
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
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        await deleteDoc(doc(db, "recipes", id));
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  return (
    <>
      <Card
        sx={{
          width: 250,
          margin: "auto",
        }}
      >
        <Link
          to={`/recipes/${recipe.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardMedia
            component="img"
            height="140"
            image="https://mui.com/static/images/cards/paella.jpg"
            title="green iguana"
          />
        </Link>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.name}{" "}
          </Typography>
          <Typography
            variant="body2"
            color={recipe.cookTime > 30 ? "error" : "text.primary"}
          >
            Takes{" "}
            {`${Math.floor(recipe.cookTime / 60)}h ${recipe.cookTime % 60}m`}
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
            {recipe.description}
          </Typography>
        </CardContent>
        <CardActions display="flex" justifyContent="space-between">
          <FavoriteIcon
            onClick={() => handleLikeRecipe()}
            color={
              recipe.usersLiked.includes(currentUser.uid) ? "primary" : "action"
            }
          />
          {recipe.usersLiked.length}
          <Button size="small"></Button>
        </CardActions>
      </Card>
    </>
  );
};
