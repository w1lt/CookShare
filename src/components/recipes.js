import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { onSnapshot, query, collection } from "firebase/firestore";
import { Recipe } from "./recipe";

export const Recipes = () => {
  const [recipeList, setRecipeList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "recipes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
        }
        if (change.type === "modified") {
        }
        if (change.type === "removed") {
        }
      });
      setRecipeList(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Recipes:</h1>
      <div>
        {recipeList &&
          recipeList
            .sort((a, b) => b.usersLiked.length - a.usersLiked.length)
            .map((recipe) => <Recipe {...recipe} />)}
      </div>
    </div>
  );
};
