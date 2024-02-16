import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import {
  Box,
  Button,
  Container,
  Grid,
  Icon,
  LinearProgress,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AvTimerIcon from "@mui/icons-material/AvTimer";

export const RecipeForm = () => {
  const [isloading, setIsLoading] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsArr, setIngredientsArr] = useState([]);
  const [currIngredient, setCurrIngredient] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [ingredientAMT, setIngredientAMT] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState("oz");

  useEffect(() => {
    document.title = "CS | Add Recipe";
  }, []);

  const units = [
    { value: "item", label: "item" },
    { value: "pinch", label: "pinch" },
    { value: "tsp", label: "tsp" },
    { value: "tbsp", label: "tbsp" },
    { value: "cup", label: "cup" },
    { value: "oz", label: "oz" },
    { value: "lb", label: "lb" },
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "bottle", label: "bottle" },
    { value: "bag", label: "bag" },
  ];

  const handleAddIngredient = () => {
    if (!currIngredient) return;
    //check if ingredient name is already in the list
    if (ingredientsArr.some((item) => item.name === currIngredient)) return;
    setIngredientsArr((prev) => [
      ...prev,
      {
        name: currIngredient,
        amount: ingredientAMT,
        unit: selectedUnit,
      },
    ]);
    setCurrIngredient("");
  };

  const onSubmitRecipe = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        ingredients: ingredientsArr,
        instructions: instructions,
        authorUid: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        dateAuthored: new Date().toLocaleString(),
        usersLiked: [],
        description: description,
        cookTime: Number(cookTime),
      });
      setIsLoading(false);
      //clear input field and refresh their state
      setRecipeName("");
      setCurrIngredient("");
      setInstructions("");
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
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
          justifyContent: "center",
          gap: 3,
        }}
      >
        <form onSubmit={onSubmitRecipe}>
          <h1>Add Recipe</h1>

          <Box
            component="form"
            noValidate
            sx={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <TextField
              type="text"
              placeholder="Spaghetti Carbonara"
              value={recipeName}
              label="Recipe Name"
              onChange={(e) => setRecipeName(e.target.value)}
              variant="outlined"
            />
            <TextField
              type="text"
              variant="outlined"
              label="Description"
              placeholder="A delicious twist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
              }}
            >
              <TextField
                type="number"
                variant="outlined"
                label="Amt"
                sx={{ width: "35%" }}
                placeholder="5"
                value={ingredientAMT}
                onChange={(e) => setIngredientAMT(e.target.value)}
              />
              <TextField
                type="text"
                variant="outlined"
                sx={{ width: "35%" }}
                select
                SelectProps={{
                  native: true,
                }}
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                {units.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
              <TextField
                type="text"
                fullWidth
                variant="outlined"
                label="Ingredient"
                placeholder='"Enter" to Add'
                value={currIngredient}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddIngredient();
                  } else if (e.key === ",") {
                    setIngredientsArr((prev) => [...prev, currIngredient]);
                    setCurrIngredient("");
                  } else if (e.key === "Backspace" && !currIngredient) {
                    setIngredientsArr((prev) => prev.slice(0, -1));
                  }
                }}
                onChange={(e) => setCurrIngredient(e.target.value)}
              />
              <Button onClick={() => handleAddIngredient()} variant="contained">
                Add
              </Button>
            </Box>

            <Grid container spacing={0.5}>
              {ingredientsArr.map((ingredient, index) => (
                <Grid item key={index}>
                  <Button
                    textTransform="none"
                    variant="outlined"
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "pink")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                    onClick={() =>
                      setIngredientsArr((prev) =>
                        prev.filter((item) => item !== ingredient)
                      )
                    }
                  >
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <TextField
              type="text"
              variant="outlined"
              label="Instructions"
              placeholder="Add sauce..."
              value={instructions}
              multiline
              onChange={(e) => setInstructions(e.target.value)}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Icon sx={{ width: "10%" }}>
                <AvTimerIcon />
              </Icon>
              <Slider
                onChange={(e, value) => setCookTime(value)}
                value={cookTime}
                defaultValue={30}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={5}
                marks
                color={
                  cookTime <= 60
                    ? "success"
                    : cookTime > 60 && cookTime <= 120
                    ? "warning"
                    : "error"
                }
                min={5}
                max={150}
              />
              <Typography sx={{ width: "40%" }} id="non-linear-slider">
                {cookTime < 60
                  ? cookTime + " minutes"
                  : Math.floor(cookTime / 60) +
                    " hours " +
                    (cookTime % 60 === 0 ? "" : (cookTime % 60) + "m")}{" "}
              </Typography>
            </Box>
            {isloading ? (
              <LinearProgress />
            ) : (
              <Button
                variant="contained"
                onClick={(e) => onSubmitRecipe(e)}
                disabled={
                  !recipeName ||
                  !ingredientsArr ||
                  !instructions ||
                  !description
                }
              >
                Add Recipe
              </Button>
            )}
          </Box>
        </form>
      </Container>
    </>
  );
};
