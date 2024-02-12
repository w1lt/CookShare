import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";
import { auth } from "../config/firebase";

export const RecipeForm = () => {
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const onSubmitRecipe = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "recipes"), {
        name: recipeName,
        ingredients: ingredients,
        instructions: instructions,
        author: auth.currentUser.displayName,
        authorUid: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        dateAuthored: new Date().toLocaleString(),
        usersLiked: [],
      });
      //clear input field and refresh their state
      setRecipeName("");
      setIngredients("");
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  return (
    <form onSubmit={onSubmitRecipe}>
      <div>
        <h1>Add Recipe</h1>
        <label>Recipe name: </label>
        <input
          type="text"
          placeholder="Recipe Name"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
      </div>
      <label>Ingredients: </label>
      <input
        type="text"
        placeholder="eg. cheese, tomato, ..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <div>
        <label>instructions: </label>
        <input
          type="text"
          placeholder="add sauce..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" disabled={!recipeName || !ingredients}>
          Add Recipe
        </button>
      </div>
    </form>
  );
};
