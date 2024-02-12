import { UserContext } from "../App";
import { useContext } from "react";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";

export const Recipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().username);
        setAuthorUsername(docSnap.data().username);
      } else {
      }
    });
  };

  getUsernameFromUid(recipe.authorUid);

  const handleLikeRecipe = async () => {
    try {
      if (recipe.usersLiked.includes(currentUser.uid)) {
        await updateDoc(doc(db, "recipes", recipe.id), {
          usersLiked: recipe.usersLiked.filter(
            (user) => user !== currentUser.uid
          ),
        });
      } else {
        await updateDoc(doc(db, "recipes", recipe.id), {
          usersLiked: [...recipe.usersLiked, currentUser.uid],
        });
      }
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  const handleDeleteRecipe = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        await deleteDoc(doc(db, "recipes", id));
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  return (
    <>
      <div>
        <i>{authorUsername}</i>: <b>{recipe.name + " "}</b>
        <button onClick={() => handleLikeRecipe(recipe.id)}>
          {recipe.usersLiked.length || 0} Likes
          {recipe.usersLiked.includes(currentUser.uid) ? " ❤️" : ""}
        </button>
        {currentUser.uid === recipe.authorUid && (
          <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
        )}
        <div>added: {recipe.dateAuthored}</div>
        <p>
          {recipe.ingredients.split(",").map((e) => (
            <li key={recipe.authorUid}>{e}</li>
          ))}
        </p>
        <p>{recipe.instructions}</p>
      </div>
    </>
  );
};
