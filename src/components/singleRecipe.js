import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { UserContext } from "../App";

export const SingleRecipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");

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

  const calcCookTime = (cookTime) => {
    const hours = Math.floor(cookTime / 60);
    const minutes = cookTime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        localStorage.setItem(`authorUsername_${uid}`, username);
      }
    });
  };
  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
            }}
          >
            <Typography variant="h5">{recipe.name}</Typography>

            {recipe.usersLiked.includes(currentUser.uid) ? (
              <BookmarkIcon
                cursor="pointer"
                onClick={() => handleLikeRecipe()}
                color="primary"
                fontSize="medium"
              />
            ) : (
              <BookmarkBorderIcon
                onClick={() => handleLikeRecipe()}
                cursor="pointer"
                fontSize="medium"
              />
            )}
          </Box>

          <Button
            style={{ textTransform: "none" }}
            component={Link}
            to={`/profile/${authorUsername}`}
            variant="outlined"
          >
            {authorUsername}
          </Button>
        </Box>

        <img
          src={recipe.image}
          alt={recipe.name}
          style={{
            borderRadius: "10px",
            width: "100%",
            height: "100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            overflow: "hidden",
          }}
        />
        <Typography variant="h8">
          "{recipe.description ? recipe.description : "No description"}"
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {calcCookTime(recipe.cookTime)} - Makes{" "}
          {recipe.servings ? recipe.servings : 1}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <List>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: 0,
                }}
              >
                <Checkbox label={ingredient.name} />
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </ListItem>
            ))}
          </List>
        </Box>
        <div>
          <h2>Instructions</h2>
          {recipe.instructions}
        </div>
      </Container>
    </>
  );
};
