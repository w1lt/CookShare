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
  LinearProgress,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import styled from "@emotion/styled";
import Compress from "compress.js";
import { Navigate } from "react-router-dom";

export const RecipeForm = () => {
  const [isloading, setIsLoading] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsArr, setIngredientsArr] = useState([]);
  const [currIngredient, setCurrIngredient] = useState("");
  const [instructions, setInstructions] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState(30);
  const [ingredientAMT, setIngredientAMT] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [servings, setServings] = useState("");
  const [recipeUploaded, setRecipeUploaded] = useState(null);

  useEffect(() => {
    document.title = "CS | Add Recipe";
  }, []);

  const units = [
    { value: "", label: "" },
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
    setIngredientAMT("");
    setSelectedUnit("oz");
    setCurrIngredient("");
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
        instructions: instructions,
        authorUid: auth.currentUser.uid,
        dateAuthored: new Date().toLocaleString(),
        usersLiked: [],
        description: description,
        cookTime: Number(cookTime),
        servings: servings,
      }) //then get the id of the new recipe and upload the image to storage using the id
        .then(async (docRef) => {
          const storage = getStorage();
          const storageRef = ref(storage, `recipeImages/${docRef.id}`);
          await uploadBytes(storageRef, recipeImage);
          await updateDoc(doc(db, "recipes", docRef.id), {
            image: await getDownloadURL(storageRef),
          });
          setRecipeUploaded(docRef.id);
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
                sx={{ width: "80%" }}
                placeholder="Spaghetti Carbonara"
                value={recipeName}
                label="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
                variant="outlined"
              />
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                color={recipeImage ? "secondary" : "primary"}
                tabIndex={-1}
                sx={{ whiteSpace: "nowrap" }}
                startIcon={<AddAPhotoIcon />}
              >
                {recipeImage ? "Change Img" : "Add Img"}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleImageUpload(e)}
                />
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
                type="number"
                variant="outlined"
                label="Qty"
                sx={{ width: "25%" }}
                placeholder="5"
                value={ingredientAMT}
                onChange={(e) => setIngredientAMT(e.target.value)}
              />
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedUnit}
                label="Age"
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                {units.map((unit, index) => (
                  <MenuItem key={index} value={unit.value}>
                    {unit.label}
                  </MenuItem>
                ))}
              </Select>
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
            </Box>
            <Box>
              <Button
                fullWidth
                onClick={() => handleAddIngredient()}
                variant="outlined"
              >
                Add Ingredient
              </Button>
            </Box>

            <Grid container spacing={0.5}>
              {ingredientsArr.map((ingredient, index) => (
                <Grid item key={index}>
                  <Button
                    style={{ textTransform: "none" }}
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
              placeholder="ex. Add sauce..."
              value={instructions}
              multiline
              onChange={(e) => setInstructions(e.target.value)}
            />
            <TextField
              type="text"
              variant="outlined"
              label="Yield"
              placeholder="ex. 6 servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
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
                  !description ||
                  !recipeImage
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
