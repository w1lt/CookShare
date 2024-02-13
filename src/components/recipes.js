import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { onSnapshot, query, collection } from "firebase/firestore";
import { Recipe } from "./recipe";
import { UserContext } from "../App";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export const Recipes = () => {
  const currentUser = useContext(UserContext);
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    const cachedRecipeList = localStorage.getItem("recipeList");
    if (cachedRecipeList) {
      setRecipeList(JSON.parse(cachedRecipeList));
    }

    const q = query(collection(db, "recipes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedRecipeList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipeList(updatedRecipeList);
      localStorage.setItem("recipeList", JSON.stringify(updatedRecipeList));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {currentUser ? (
        <div>
          <h1>Recipes:</h1>
          <div>
            {recipeList &&
              recipeList
                .sort((a, b) => b.dateAuthored - a.dateAuthored)
                .map((recipe) => <Recipe {...recipe} />)}
          </div>
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};
