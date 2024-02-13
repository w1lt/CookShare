import { useParams } from "react-router-dom";
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Recipe } from "../components/recipe";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";

export const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState("");
  const [userRecipes, setUserRecipes] = useState([]);
  const currentUser = useContext(UserContext);
  let { username } = useParams();

  useEffect(() => {
    const cachedUserInfo = localStorage.getItem(`userInfo_${username}`);
    const cachedRecipeList = localStorage.getItem(`userRecipes_${username}`);

    if (cachedUserInfo) {
      setUserInfo(JSON.parse(cachedUserInfo));
    }
    if (cachedRecipeList) {
      setUserRecipes(JSON.parse(cachedRecipeList));
    }

    const q = query(collection(db, "users"), where("username", "==", username));
    const unsubscribeUserData = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setUserInfo(userData);
        console.log("Updated user info:");
        setUserId(snapshot.docs[0].id);
        localStorage.setItem(`userInfo_${username}`, JSON.stringify(userData));
      } else {
        console.error("No user found with username:", username);
      }
    });

    return () => {
      unsubscribeUserData();
    };
  }, [username]);

  useEffect(() => {
    if (userId) {
      const q2 = query(
        collection(db, "recipes"),
        where("authorUid", "==", userId)
      );
      const unsubscribeRecipeList = onSnapshot(q2, (snapshot) => {
        const updatedRecipeList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserRecipes(updatedRecipeList);
        console.log("Updated recipe list:");
        localStorage.setItem(
          `userRecipes_${username}`,
          JSON.stringify(updatedRecipeList)
        );
      });

      return () => {
        unsubscribeRecipeList();
      };
    }
  }, [userId, username]);

  const followUser = async () => {
    const q = query(
      collection(db, "users"),
      where("username", "==", currentUser.displayName)
    );
    const querySnapshot = await getDocs(q);
    const authduserdata = querySnapshot.docs[0].data();
    if (!userInfo.followers.includes(currentUser.uid)) {
      await updateDoc(doc(db, "users", userId), {
        followers: [...userInfo.followers, currentUser.uid],
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        following: [...authduserdata.followers, userId],
      });

      console.log("Followed user:", username);
    } else {
      await updateDoc(doc(db, "users", userId), {
        followers: userInfo.followers.filter(
          (user) => user !== currentUser.uid
        ),
      });
      await updateDoc(doc(db, "users", currentUser.uid), {
        following: authduserdata.followers.filter((user) => user !== userId),
      });
      console.log("Unfollowed user:", username);
    }
  };

  return (
    <div>
      <div style={{ padding: "10px", fontSize: "20px" }}>
        {username}
        &nbsp;
        {currentUser.displayName !== userInfo.username && (
          <button onClick={() => followUser()}>
            {userInfo && Object.keys(userInfo).length > 0 ? (
              <div>
                {userInfo.followers.includes(currentUser.uid)
                  ? "Unfollow"
                  : "Follow"}
              </div>
            ) : (
              <div>Loading user information...</div>
            )}
          </button>
        )}
      </div>
      <div>
        {userInfo && Object.keys(userInfo).length > 0 ? (
          <div>
            {userRecipes.length || 0} Recipes | {userInfo.followers.length || 0}{" "}
            Followers | {userInfo.following.length || 0} Following
          </div>
        ) : (
          <div>Loading user information...</div>
        )}
      </div>
      <div>{username}'s Recipes:</div>

      <div>
        {userRecipes &&
          userRecipes.map((recipe) => <Recipe {...recipe} key={recipe.id} />)}
      </div>
    </div>
  );
};
