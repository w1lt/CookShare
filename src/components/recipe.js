import { UserContext } from "../App";
import { useContext, useEffect } from "react";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Recipe = (recipe) => {
  const currentUser = useContext(UserContext);
  const [authorUsername, setAuthorUsername] = useState("");

  const getUsernameFromUid = (uid) => {
    getDoc(doc(db, "users", uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        setAuthorUsername(username);
        // Store the username in localStorage
        localStorage.setItem(`authorUsername_${uid}`, username);
      }
    });
  };

  useEffect(() => {
    // Check if the username is already cached in localStorage
    const cachedUsername = localStorage.getItem(
      `authorUsername_${recipe.authorUid}`
    );
    if (cachedUsername) {
      setAuthorUsername(cachedUsername);
    } else {
      getUsernameFromUid(recipe.authorUid);
    }
  }, [recipe.authorUid]);

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
        <i>
          {authorUsername ? (
            <Link to={`/profile/${authorUsername}`}>{authorUsername}</Link>
          ) : (
            "username"
          )}
        </i>
        : <b>{recipe.name + " "}</b>
        <button onClick={() => handleLikeRecipe(recipe.id)}>
          {recipe.usersLiked.length || 0}
          {recipe.usersLiked.length === 1 ? " Like" : " Likes"}
          {recipe.usersLiked.includes(currentUser.uid) ? " ❤️" : " "}
        </button>
        {currentUser.uid === recipe.authorUid && (
          <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
        )}
        <div>{recipe.dateAuthored.split(",")[0]}</div>
        <p>
          {recipe.ingredients.split(",").map((e) => (
            <li key={e}>{e}</li>
          ))}
        </p>
        <p>{recipe.instructions}</p>
      </div>
    </>
  );
};
