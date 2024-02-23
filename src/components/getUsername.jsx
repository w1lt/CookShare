import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

export const GetUsername = (uid) => {
  const getUsernameFromUid = async (uid) => {
    await getDoc(doc(db, "users", uid.userId)).then((docSnap) => {
      console.log("money");
      if (docSnap.exists()) {
        const username = docSnap.data().username;
        localStorage.setItem(`authorUsername_${uid}`, username);
        return;
      }
    });
  };
  useEffect(() => {
    const cachedUsername = localStorage.getItem(`authorUsername_${uid.userId}`);
    if (cachedUsername) {
    } else {
      localStorage.setItem(
        `authorUsername_${uid.userId}`,
        getUsernameFromUid(uid.userId)
      );
    }
  }, [uid]);

  return (
    <>
      <Link
        to={`/profile/${localStorage.getItem(`authorUsername_${uid.userId}`)}`}
      >
        {localStorage.getItem(`authorUsername_${uid.userId}`) || "loading..."}
      </Link>
    </>
  );
};
