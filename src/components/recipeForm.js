import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  Icon,
  IconButton,
  LinearProgress,
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
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

export const RecipeForm = () => {
  const [isloading, setIsLoading] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredientsArr, setIngredientsArr] = useState([]);
  const [currIngredient, setCurrIngredient] = useState("");
  const [instructionsArr, setInstructionsArr] = useState([]);
  const [currInstruction, setCurrInstruction] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState(70);
  const [ingredientAMT, setIngredientAMT] = useState("1");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [servings, setServings] = useState("");
  const [recipeUploaded, setRecipeUploaded] = useState(null);

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
    const hours = Math.floor(cookTime / 60);
    const minutes = cookTime % 60;
    if (hours >= 1) {
      if (minutes === 0) {
        return `Takes ${hours}h`;
      } else {
        return `Takes ${hours}h ${minutes}m`;
      }
    } else {
      return `Takes ${minutes}m`;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compress = new Compress();
    compress
      .compress([file], {
        size: 0.1, // the max size in MB, defaults to 2MB
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
    setCurrIngredient("");
    document.getElementById("ingredient").focus();
  };

  const handleAddInstruction = () => {
    if (!currInstruction) return;
    if (instructionsArr.includes(currInstruction)) return;
    setInstructionsArr((prev) => [...prev, currInstruction]);
    setCurrInstruction("");
    document.getElementById("instruction").focus();
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
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create New Recipe
        </Typography>
        <form onSubmit={onSubmitRecipe}>
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
                required
                autoFocus
                type="text"
                placeholder="ex. Spaghetti Carbonara"
                value={recipeName}
                fullWidth
                label="Recipe Name"
                onChange={(e) => setRecipeName(e.target.value)}
                variant="outlined"
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("description").focus();
                  }
                }}
              />
            </Box>

            <TextField
              type="text"
              id="description"
              variant="outlined"
              multiline
              label="Description"
              placeholder="ex. A delicious twist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("ingredient").focus();
                }
              }}
              tabIndex="1"
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
                onBlur={
                  ingredientAMT === "" ? () => setIngredientAMT("1") : null
                }
                inputProps={{ inputMode: "numeric", tabIndex: "-1" }}
                tabIndex="-1"
                variant="outlined"
                label="Qty"
                sx={{ width: "20%" }}
                value={ingredientAMT}
                onChange={(e) =>
                  setIngredientAMT(parseInt(e.target.value) || "")
                }
              />
              <Autocomplete
                freeSolo
                options={units}
                value={selectedUnit}
                onChange={(e, value) => {
                  if (value) {
                    setSelectedUnit(value.value);
                  } else {
                    setSelectedUnit("");
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    label="Unit"
                  />
                )}
              />

              <TextField
                required={!currIngredient && ingredientsArr.length === 0}
                tabIndex="2"
                type="text"
                id="ingredient"
                fullWidth
                variant="outlined"
                label={
                  ingredientsArr.length === 0
                    ? "Add First Ingredient"
                    : "Add Ingredient " + (ingredientsArr.length + 1)
                }
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
                      <IconButton tabIndex={"-1"}>
                        <AddIcon onClick={handleAddIngredient} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {ingredientsArr.length > 0 && (
              <Grid container spacing={0.5}>
                {ingredientsArr.map((ingredient, index) => (
                  <Grid item key={index}>
                    <Button
                      tabIndex={"-1"}
                      style={{
                        textTransform: "none",
                        color: "inherit",
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                      }}
                      textTransform="none"
                      variant="outlined"
                    >
                      {ingredient.amount} {ingredient.unit} {ingredient.name}{" "}
                      <IconButton
                        sx={{
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      >
                        <ClearIcon
                          sx={{
                            width: "1rem",
                            height: "1rem",
                          }}
                          onClick={() =>
                            setIngredientsArr((prev) =>
                              prev.filter((item) => item !== ingredient)
                            )
                          }
                        />
                      </IconButton>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
              <TextField
                required={!currInstruction && instructionsArr.length === 0}
                type="text"
                variant="outlined"
                label={"Create Step " + (instructionsArr.length + 1)}
                inputProps={{ tabIndex: "0" }}
                id="instruction"
                placeholder="Instruction"
                value={currInstruction}
                onChange={(e) => setCurrInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddInstruction();
                  } else if (e.key === "Backspace" && !currInstruction) {
                    setInstructionsArr((prev) => prev.slice(0, -1));
                  }
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton tabIndex={"-1"}>
                        <AddIcon onClick={handleAddInstruction} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {instructionsArr.length > 0 && (
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  justifyContent: "left",
                }}
              >
                {instructionsArr.map((instruction, index) => (
                  <TextField
                    tabIndex={"-1"}
                    value={instruction}
                    key={index}
                    sx={{
                      textAlign: "left",
                      marginBottom: "0.25rem",
                      color: "inherit",
                    }}
                    style={{ textTransform: "none" }}
                    textTransform="none"
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !instruction) {
                        setInstructionsArr((prev) =>
                          prev.filter((item) => item !== instruction)
                        );
                      }
                    }}
                    onChange={(e) =>
                      setInstructionsArr((prev) =>
                        prev.map((item) =>
                          item === instruction ? e.target.value : item
                        )
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {index + 1 + ". "}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            sx={{
                              width: "1.5rem",
                              height: "1.5rem",
                            }}
                          >
                            <ClearIcon
                              sx={{
                                width: "1rem",
                                height: "1rem",
                              }}
                              onClick={() =>
                                setInstructionsArr((prev) =>
                                  prev.filter((item) => item !== instruction)
                                )
                              }
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                ))}
              </Grid>
            )}
            <TextField
              required
              id="quantity"
              inputProps={{ inputMode: "numeric" }}
              variant="outlined"
              label="Yield"
              placeholder="ex. 6 "
              InputProps={{
                endAdornment: <InputAdornment>Servings</InputAdornment>,
              }}
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || "")}
            />
            <Button
              component="label"
              variant="contained"
              sx={{
                padding: "1rem",
              }}
              color={recipeImage ? "error" : "inherit"}
              startIcon={recipeImage ? null : <AddAPhotoIcon />}
              tabIndex="-1"
            >
              {recipeImage ? "Remove Img" : "Add image"}
              {!recipeImage ? (
                <VisuallyHiddenInput
                  tabIndex="-1"
                  type="file"
                  onChange={(e) => handleImageUpload(e)}
                />
              ) : (
                <VisuallyHiddenInput onClick={(e) => setRecipeImage(null)} />
              )}
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
              }}
            >
              <Icon>
                <AccessTimeIcon
                  color={
                    cookTime <= 60
                      ? "success"
                      : cookTime > 60 && cookTime <= 120
                      ? "warning"
                      : "error"
                  }
                />
              </Icon>
              <Slider
                onChange={(e, value) => setCookTime(value)}
                value={cookTime}
                defaultValue={30}
                valueLabelDisplay="auto"
                valueLabelFormat={calcCookTime}
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
            </Box>
            {isloading ? (
              <LinearProgress />
            ) : (
              <Button
                sx={{
                  padding: "1rem",
                  marginTop: "1rem",
                }}
                variant="contained"
                onClick={(e) => onSubmitRecipe(e)}
                color="success"
                disabled={
                  !recipeName ||
                  !ingredientsArr.length === 0 ||
                  instructionsArr.length === 0 ||
                  !servings ||
                  !cookTime
                }
              >
                Create New Recipe!
              </Button>
            )}
          </Box>
        </form>
      </Container>
    </>
  );
};
