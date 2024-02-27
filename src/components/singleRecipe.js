import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  List,
  ListItem,
  Snackbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { UserContext } from "../App";
import { MoreVert } from "@mui/icons-material";
import { BASE_DOMAIN } from "../static/vars";

export const SingleRecipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");
  const [showLikedAlert, setShowLikedAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(() => {
    const savedItems = localStorage.getItem(`checkedItems-${recipe.id}`);
    return savedItems
      ? JSON.parse(savedItems)
      : new Array(recipe.ingredients.length).fill(false);
  });

  const saveCheckedItemsToLocalstorage = (items) => {
    localStorage.setItem(`checkedItems-${recipe.id}`, JSON.stringify(items));
  };

  const handleCheckItem = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    saveCheckedItemsToLocalstorage(newCheckedItems);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
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
        setShowLikedAlert(true);
        setTimeout(() => {
          setShowLikedAlert(false);
        }, 2500);
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
  const copyRecipeLink = () => {
    const recipeLink = `${BASE_DOMAIN}/recipes/${recipe.id}`;
    navigator.clipboard.writeText(recipeLink);
    setOpen(false);
  };
  const handleDeleteRecipe = async (id) => {
    try {
      await deleteDoc(doc(db, "recipes", recipe.id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        setAuthorUsername(username);
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
          gap: 0.5,
        }}
      >
        <Snackbar open={showLikedAlert} autoHideDuration={3000}>
          <Alert severity="success" sx={{ width: 300, margin: "auto" }}>
            Recipe saved
          </Alert>
        </Snackbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "inline",
              verticalAlign: "middle",
            }}
          >
            {recipe.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0,
            }}
          >
            {recipe.usersLiked.includes(currentUser.uid) ? (
              <BookmarkIcon
                cursor="pointer"
                onClick={() => handleLikeRecipe()}
                color="primary"
                fontSize="medium"
                sx={{
                  verticalAlign: "middle",
                }}
              />
            ) : (
              <BookmarkBorderIcon
                onClick={() => handleLikeRecipe()}
                cursor="pointer"
                fontSize="medium"
                sx={{
                  verticalAlign: "middle",
                }}
              />
            )}
            <MoreVert
              style={{ marginLeft: "auto" }}
              cursor="pointer"
              onClick={handleOpen}
            />
          </Box>

          <Dialog open={open} onClose={() => setOpen(false)}>
            {currentUser.uid === recipe.authorUid && (
              <Button onClick={handleDeleteRecipe}>Delete Recipe</Button>
            )}
            <Button onClick={copyRecipeLink}>Copy Link</Button>
          </Dialog>
        </Box>

        {recipe.image && (
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
        )}
        <Typography
          variant="h8"
          sx={{
            fontStyle: "italic",
          }}
        >
          "{recipe.description ? recipe.description : "No description"}" -{" "}
          <Typography
            style={{
              color: "inherit",
            }}
            component={Link}
            to={`/profile/${authorUsername}`}
          >
            {authorUsername ? authorUsername : "Loading..."}
          </Typography>
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
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    textDecoration: checkedItems[index]
                      ? "line-through"
                      : "none",
                    width: "100%",
                  }}
                >
                  <Checkbox
                    id={`ingredient-checkbox-${index}`}
                    checked={checkedItems[index]}
                    onChange={() => handleCheckItem(index)}
                  />
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCheckItem(index);
                    }}
                  >
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </div>
              </ListItem>
            ))}
          </List>
        </Box>
        <div>
          <h2>Instructions</h2>

          {typeof recipe.instructions === "string" ? (
            <p>{recipe.instructions}</p>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",

                        width: "100%",
                      }}
                    >
                      {index + 1}
                      {". "}
                      {instruction}
                    </div>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </div>
      </Container>
    </>
  );
};
