import { useParams } from "react-router-dom";
import { Recipe } from "../components/recipe";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
export const RecipePost = () => {
  let { id } = useParams();
  const [recipe, setRecipe] = useState([]);

  const getRecipeFromId = (id) => {
    getDoc(doc(db, "users", id)).then((docSnap) => {
      if (docSnap.exists()) {
        setRecipe(docSnap.data());
        // Store the username in localStorage
        localStorage.setItem(`recipeList_${id}`, docSnap.data());
      }
    });
  };

  useEffect(() => {
    // Check if the username is already cached in localStorage
    const cachedRecipe = localStorage.getItem(`recipeList_${id}`);
    if (cachedRecipe) {
      setRecipe(cachedRecipe);
    } else {
      setRecipe(getRecipeFromId(id));
    }
  }, [id]);
  return (
    <div>
      <Recipe {...recipe} />
    </div>
  );
};
