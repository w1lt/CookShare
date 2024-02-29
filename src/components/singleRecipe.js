import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  List,
  ListItem,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { UserContext } from "../App";
import { MoreVert } from "@mui/icons-material";
import { BASE_DOMAIN } from "../static/vars";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const SingleRecipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");
  const [showLikedAlert, setShowLikedAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [checkedItems, setCheckedItems] = useState(() => {
    const savedItems = localStorage.getItem(`checkedItems-${recipe.id}`);
    return savedItems
      ? JSON.parse(savedItems)
      : new Array(recipe.ingredients.length).fill(false);
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const saveCheckedItemsToLocalstorage = (items) => {
    localStorage.setItem(`checkedItems-${recipe.id}`, JSON.stringify(items));
  };

  const handleCheckItem = (index) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
    saveCheckedItemsToLocalstorage(newCheckedItems);
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
            alignContent: "center",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              margin: 0,
              padding: 0,
            }}
          >
            {recipe.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 0.1,
            }}
          >
            <Button
              component={Link}
              variant="outlined"
              to={`/profile/${authorUsername}`}
              style={{
                textTransform: "none",
                textDecoration: "none",
                color: "inherit",
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
              }}
            >
              {authorUsername}
            </Button>
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
              id="recipe-menu"
              style={{ padding: 0, margin: 0 }}
              cursor="pointer"
              onClick={handleClick}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(open)}
              onClose={handleClose}
            >
              <MenuItem onClick={copyRecipeLink}>Copy Link</MenuItem>
              {currentUser.uid === recipe.authorUid && (
                <MenuItem onClick={handleDeleteRecipe}>Delete Recipe</MenuItem>
              )}
            </Menu>
          </Box>
        </Box>

        <img
          src={
            recipe.image ||
            "https://www.mimisrecipes.com/wp-content/uploads/2018/12/recipe-placeholder-featured.jpg"
          }
          alt={recipe.name}
          style={{
            borderRadius: "10px",
          }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            padding: 1,
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 1.5,
            }}
            s
          >
            <Typography>{recipe.ingredients.length} Ingred.</Typography>
          </Card>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 1.5,
            }}
          >
            <Typography
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0.1,
              }}
            >
              <AccessTimeIcon fontSize="1" />
              {calcCookTime(recipe.cookTime)}
            </Typography>
          </Card>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 1.5,
            }}
          >
            <Typography>{recipe.servings || 1} Serving(s)</Typography>
          </Card>
        </Box>

        <Typography
          variant="h6"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          What you'll need:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            gap: 1,
          }}
        >
          <List>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem
                key={index}
                sx={{
                  padding: 1,
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
                    opacity: checkedItems[index] ? 0.5 : 1,
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
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            How to make it:
          </Typography>

          {typeof recipe.instructions === "string" ? (
            <p>{recipe.instructions}</p>
          ) : (
            <Box>
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem key={index}>
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
                      {instruction.charAt(0).toUpperCase() +
                        instruction.slice(1)}
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
