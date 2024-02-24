import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import {
  query,
  collection,
  where,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { RecipeCard } from "../components/recipeCard";
import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { GetUsername } from "../components/getUsername";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState("");
  const [userRecipes, setUserRecipes] = useState([]);
  const currentUser = useContext(UserContext);
  const [followersOpen, setFollowersOpen] = useState();
  const [followingOpen, setFollowingOpen] = useState();
  const [authduserdata, setAuthduserdata] = useState({});
  const [isloading, setIsLoading] = useState(true);

  let { username } = useParams();

  document.title = `CS | ${username}`;

  useEffect(() => {
    if (window.location.pathname.includes("followers")) {
      setFollowersOpen(true);
    } else if (window.location.pathname.includes("following")) {
      setFollowingOpen(true);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "users"), where("username", "==", username));
    const unsubscribeUserInfo = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        setUserInfo(doc.data());
        setUserId(doc.id);
      });
    });

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
      setIsLoading(false);
      return () => {
        unsubscribeRecipeList();
        unsubscribeUserInfo();
      };
    }
  }, [userId, username]);

  const followUser = async () => {
    await getDoc(doc(db, "users", currentUser.uid)).then((docSnap) => {
      setAuthduserdata(docSnap.data());
    });

    const updatedFollowers = new Set(userInfo.followers || []);
    const updatedFollowing = new Set(authduserdata.following || []);

    if (updatedFollowers.has(currentUser.uid)) {
      if (!window.confirm("Are you sure you want to unfollow this user?"))
        return;

      updatedFollowers.delete(currentUser.uid);
      updatedFollowing.delete(userId);
    } else {
      updatedFollowers.add(currentUser.uid);
      updatedFollowing.add(userId);
    }

    await updateDoc(doc(db, "users", userId), {
      followers: [...updatedFollowers],
    });
    await updateDoc(doc(db, "users", currentUser.uid), {
      following: [...updatedFollowing],
    });
  };

  const handleCloseDialogs = () => {
    setFollowersOpen(false);
    setFollowingOpen(false);
    navigate(`/profile/${username}`);
  };

  return isloading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography variant="h4" component="h1">
            {username}{" "}
            {currentUser.displayName !== username && (
              <Button
                variant={
                  userInfo.followers?.includes(currentUser.uid)
                    ? "contained"
                    : "outlined"
                }
                onClick={followUser}
              >
                {userInfo.followers?.includes(currentUser.uid)
                  ? "Following"
                  : "Follow"}
              </Button>
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
            padding: 2,
            marginBottom: 1,
          }}
        >
          <Typography variant="p" component="h4">
            {userRecipes?.length} Recipes
          </Typography>
          <Typography
            variant="p"
            component="h4"
            style={
              userInfo.followers?.length > 0
                ? { cursor: "pointer" }
                : { color: "gray" }
            }
          >
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={`/profile/${username}/followers`}
              onClick={
                userInfo.followers?.length > 0
                  ? () => setFollowersOpen(true)
                  : undefined
              }
            >
              {userInfo.followers?.length} Followers
            </Link>
          </Typography>
          <Typography
            variant="p"
            component="h4"
            style={
              userInfo.following?.length > 0
                ? { cursor: "pointer" }
                : { color: "gray" }
            }
          >
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={
                userInfo.following?.length > 0
                  ? `/profile/${username}/following`
                  : undefined
              }
              onClick={
                userInfo.following?.length > 0
                  ? () => setFollowingOpen(true)
                  : undefined
              }
            >
              {userInfo.following?.length} Following
            </Link>
          </Typography>
        </Box>
      </Container>

      <Dialog open={followersOpen} onClose={() => handleCloseDialogs()}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
            padding: 2,
            marginBottom: 1,
          }}
        >
          {userInfo.followers?.map((follower) => (
            <Typography
              variant="p"
              component="h4"
              key={follower}
              onClick={() => {
                setFollowersOpen(false);
              }}
            >
              <GetUsername userId={follower} authduserdata={authduserdata} />
            </Typography>
          ))}
        </Box>
      </Dialog>

      <Dialog open={followingOpen} onClose={() => handleCloseDialogs()}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
            padding: 2,
            marginBottom: 1,
          }}
        >
          {userInfo.following?.map((follower) => (
            <Typography
              variant="p"
              component="h4"
              key={follower}
              onClick={() => {
                setFollowingOpen(false);
              }}
            >
              <GetUsername userId={follower} currentUser={currentUser} />
            </Typography>
          ))}
        </Box>
      </Dialog>

      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {userRecipes.map((recipe) => (
            <Grid item key={recipe.id}>
              <RecipeCard {...recipe} />
            </Grid>
          ))}
        </Box>
      </Container>
    </>
  );
};
