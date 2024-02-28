import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { onSnapshot, query, collection } from "firebase/firestore";
import { RecipeCard } from "./recipeCard";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";

export const Recipes = ({ title }) => {
  const [recipeList, setRecipeList] = useState([]);
  const [loading, setLoading] = useState(true);
  document.title = "CS | Home";

  useEffect(() => {
    setLoading(true);
    const cachedRecipeList = localStorage.getItem("recipeList");
    if (cachedRecipeList) {
      setRecipeList(JSON.parse(cachedRecipeList));
    }

    const q = query(collection(db, "recipes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ ...doc.data(), id: doc.id });
      });
      setRecipeList(recipes);
      localStorage.setItem("recipeList", JSON.stringify(recipes));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Container justifyContent="center">
        <Typography
          variant="h4"
          component="div"
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            overflow: "scroll",
          }}
        >
          {recipeList.map((recipe) => (
            <Grid item key={recipe.id}>
              {<RecipeCard {...recipe} /> || (
                <CircularProgress
                  sx={{ width: "100%", height: "100%", borderRadius: "10%" }}
                />
              )}
            </Grid>
          ))}
        </Box>
      </Container>
    </>
  );
};
