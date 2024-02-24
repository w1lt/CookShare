import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Box,
  Button,
  Container,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import styled from "@emotion/styled";
import Compress from "compress.js";
import { Navigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";

export const RecipeForm = () => {
  const [isloading, setIsLoading] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsArr, setIngredientsArr] = useState([]);
  const [currIngredient, setCurrIngredient] = useState("");
  const [instructionsArr, setInstructionsArr] = useState([]);
  const [currInstruction, setCurrInstruction] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [ingredientAMT, setIngredientAMT] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState("single");
  const [recipeImage, setRecipeImage] = useState(null);
  const [servings, setServings] = useState("");
  const [recipeUploaded, setRecipeUploaded] = useState(null);
  const [servingUnit, setServingUnit] = useState("serving");

  useEffect(() => {
    document.title = "CS | Add Recipe";
  }, []);

  const units = [
    { value: "single", label: "single" },
    { value: "serving", label: "serving" },
    { value: "Tsp", label: "tsp" },
    { value: "tbsp", label: "tbsp" },
    { value: "cup", label: "cup" },
    { value: "oz", label: "oz" },
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "bottle", label: "bottle" },
    { value: "bag", label: "bag" },
    { value: "lb", label: "lb" },
    { value: "pinch", label: "pinch" },
    { value: "scoop", label: "scoop" },
    { value: "box", label: "box" },
  ];

  const calcCookTime = (cookTime) => {
    // Convert cookTime to minutes and hours. if less than an hour just show minutes
    const hours = Math.floor(cookTime / 60);
    const minutes = cookTime % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compress = new Compress();
    compress
      .compress([file], {
        size: 0.5, // the max size in MB, defaults to 2MB
        quality: 0.5, // the quality of the image, max is 1,
        maxWidth: 1920 / 2, // the max width of the output image, defaults to 1920px
        maxHeight: 1920 / 2, // the max height of the output image, defaults to 1920px
        resize: true, // defaults to true, set false if you do not want to resize the image
      })
      .then((data) => {
        const img = data[0];
        const imgFile = Compress.convertBase64ToFile(img.data, img.ext);
        setRecipeImage(imgFile);
        console.log("compressed image:", imgFile);
      });
  };

  const handleAddIngredient = () => {
    if (!currIngredient) return;
    if (ingredientsArr.some((item) => item.name === currIngredient)) return;
    setIngredientsArr((prev) => [
      ...prev,
      {
        name: currIngredient,
        amount: ingredientAMT,
        unit: selectedUnit,
      },
    ]);
    setIngredientAMT("1");
    setSelectedUnit("single");
    setCurrIngredient("");
  };

  const handleAddInstruction = () => {
    if (!currInstruction) return;
    setInstructionsArr((prev) => [...prev, currInstruction]);
    setCurrInstruction("");
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const onSubmitRecipe = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        ingredients: ingredientsArr,
        instructions: instructionsArr,
        authorUid: auth.currentUser.uid,
        dateAuthored: new Date().toLocaleString(),
        usersLiked: [],
        description: description,
        cookTime: Number(cookTime),
        servings: Number(servings),
      }).then(async (docRef) => {
        if (recipeImage === null) {
          setRecipeUploaded(docRef.id);
          return;
        }
        const storage = getStorage();
        const storageRef = ref(storage, `recipeImages/${docRef.id}`);
        await uploadBytes(storageRef, recipeImage);
        await updateDoc(doc(db, "recipes", docRef.id), {
          image: await getDownloadURL(storageRef),
        });
        setRecipeUploaded(docRef.id);
      });
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <>
      {recipeUploaded && <Navigate to={`/recipes/${recipeUploaded}`} />}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
              }}
            >
              <TextField
                type="text"
                placeholder="ex. Spaghetti Carbonara"
                value={recipeName}
                fullWidth
                label="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
                variant="outlined"
              />
              <Button
                component="label"
                variant="outlined"
                color={recipeImage ? "error" : "primary"}
                tabIndex={-1}
                sx={{ whiteSpace: "nowrap" }}
                startIcon={recipeImage ? null : <AddAPhotoIcon />}
              >
                {recipeImage ? "Remove Img" : "Add "}
                {!recipeImage ? (
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleImageUpload(e)}
                  />
                ) : (
                  <VisuallyHiddenInput onClick={(e) => setRecipeImage(null)} />
                )}
              </Button>
            </Box>

            <TextField
              type="text"
              variant="outlined"
              multiline
              label="Description"
              placeholder="ex. A delicious twist..."
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
                id="quantity"
                onFocus={(e) => setIngredientAMT("")}
                inputProps={{ inputMode: "numeric" }}
                variant="outlined"
                label="Qty"
                sx={{ width: "20%" }}
                value={ingredientAMT}
                onChange={(e) =>
                  setIngredientAMT(parseInt(e.target.value) || "")
                }
              />
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedUnit}
                native
                onChange={(e) => setSelectedUnit(e.target.value)}
                sx={{ width: "35%" }}
              >
                {units.map((unit, index) => (
                  <option key={index} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
              <TextField
                type="text"
                fullWidth
                variant="outlined"
                label="Ingredient"
                placeholder="ex. eggs"
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <AddIcon onClick={handleAddIngredient} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Grid container spacing={0.5}>
              {ingredientsArr.map((ingredient, index) => (
                <Grid item key={index}>
                  <Button
                    style={{ textTransform: "none", color: "inherit" }}
                    textTransform="none"
                    variant="outlined"
                    onClick={() =>
                      setIngredientsArr((prev) =>
                        prev.filter((item) => item !== ingredient)
                      )
                    }
                  >
                    {ingredient.amount} {ingredient.unit} {ingredient.name}{" "}
                    <DeleteOutlineIcon
                      style={{ marginLeft: "auto" }}
                      onClick={() =>
                        setIngredientsArr((prev) =>
                          prev.filter((item) => item !== ingredient)
                        )
                      }
                    />
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
              <TextField
                type="text"
                variant="outlined"
                label="Instruction"
                placeholder="ex. Add sauce..."
                value={currInstruction}
                onChange={(e) => setCurrInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddInstruction();
                  } else if (e.key === ",") {
                    handleAddInstruction();
                  } else if (e.key === "Backspace" && !currInstruction) {
                    setInstructionsArr((prev) => prev.slice(0, -1));
                  }
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <AddIcon onClick={handleAddInstruction} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                justifyContent: "left",
              }}
            >
              {instructionsArr.map((instruction, index) => (
                <Button
                  key={index}
                  sx={{
                    justifyContent: "left",
                    textAlign: "left",
                    marginBottom: "0.25rem",
                    alignSelf: "left",
                    color: "inherit",
                  }}
                  style={{ textTransform: "none" }}
                  textTransform="none"
                  variant="outlined"
                >
                  {index + 1}. {instruction}
                  <DeleteOutlineIcon
                    style={{ marginLeft: "auto" }}
                    onClick={() =>
                      setInstructionsArr((prev) =>
                        prev.filter((item) => item !== instruction)
                      )
                    }
                  />
                </Button>
              ))}
            </Grid>
            <TextField
              id="quantity"
              inputProps={{ inputMode: "numeric" }}
              variant="outlined"
              label="Yield"
              placeholder="ex. 6 "
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ width: "40%" }}>
                    <Select
                      native
                      value={servingUnit}
                      variant="standard"
                      onChange={(e) => setServingUnit(e.target.value)}
                    >
                      <option value="serving">servings</option>
                      <option value="single">single</option>
                    </Select>
                  </InputAdornment>
                ),
              }}
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || "")}
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
                <AccessTimeIcon />
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
              <Typography sx={{ width: "50%" }} id="non-linear-slider">
                {calcCookTime(cookTime)}
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
                  !instructionsArr ||
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
