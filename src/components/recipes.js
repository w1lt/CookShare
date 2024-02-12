import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import {
  updateDoc,
  onSnapshot,
  doc,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../config/firebase";

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

  const handleDeleteRecipe = async (id) => {
    try {
      if (
        auth.currentUser.uid !==
        recipeList.find((recipe) => recipe.id === id).authorUid
      ) {
        console.error("You are not authorized to delete this recipe");
        return;
      } else {
        console.log("You are authorized to delete this recipe");
        await deleteDoc(doc(db, "recipes", id));
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleLikeRecipe = async (id) => {
    try {
      if (
        recipeList
          .find((recipe) => recipe.id === id)
          .usersLiked.includes(auth.currentUser.uid)
      ) {
        await updateDoc(doc(db, "recipes", id), {
          usersLiked: recipeList
            .find((recipe) => recipe.id === id)
            .usersLiked.filter((user) => user !== auth.currentUser.uid),
        });
      } else {
        await updateDoc(doc(db, "recipes", id), {
          usersLiked: [
            ...recipeList.find((recipe) => recipe.id === id).usersLiked,
            auth.currentUser.uid,
          ],
        });
      }
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  return (
    <div>
      <h1>Recipes:</h1>
      <div>
        {recipeList &&
          recipeList
            .sort((a, b) => b.recipeLikes - a.recipeLikes) // Sort by recipeLikes in descending order
            .map((recipe) => (
              <div>
                <i>{recipe.author}</i>: <b>{recipe.name + " "}</b>
                <button onClick={() => handleLikeRecipe(recipe.id)}>
                  {recipe.usersLiked.length || 0} Likes
                  {recipe.usersLiked.includes(auth.currentUser.uid)
                    ? " ❤️"
                    : ""}
                </button>
                {auth.currentUser.uid === recipe.authorUid && (
                  <button onClick={() => handleDeleteRecipe(recipe.id)}>
                    Delete
                  </button>
                )}
                <div>added: {recipe.dateAuthored}</div>
                <p>
                  {recipe.ingredients.split(",").map((e) => (
                    <li key={recipe.authorUid}>{e}</li>
                  ))}
                </p>
                <p>{recipe.instructions}</p>
              </div>
            ))}
      </div>
    </div>
  );
};
