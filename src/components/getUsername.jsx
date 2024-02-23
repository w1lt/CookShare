import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

export const GetUsername = ({ userId }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <>
      <Link
        to={`/profile/${userData.username}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {userData.username}{" "}
      </Link>
    </>
  );
};
