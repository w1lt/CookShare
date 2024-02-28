import { Link, useParams, useNavigate } from "react-router-dom";
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
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";

const getUserInfoFromIds = async (userIds) => {
  const usernames = [];
  for (const userId of userIds) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      usernames.push(userData);
    }
  }
  return usernames;
};

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState("");
  const [userRecipes, setUserRecipes] = useState([]);
  const currentUser = useContext(UserContext);
  const [followersOpen, setFollowersOpen] = useState();
  const [followingOpen, setFollowingOpen] = useState();
  const [authduserdata, setAuthduserdata] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  let { username } = useParams();

  document.title = `CS | ${username}`;

  useEffect(() => {
    const fetchFollowers = async () => {
      if (userInfo) {
        const followersUsernames = await getUserInfoFromIds(
          userInfo.followers || []
        );
        setFollowers(followersUsernames);
      }
    };

    const fetchFollowing = async () => {
      if (userInfo) {
        const followingUsernames = await getUserInfoFromIds(
          userInfo.following || []
        );
        setFollowing(followingUsernames);
      }
    };
    if (window.location.pathname.includes("followers")) {
      setFollowersOpen(true);
    } else if (window.location.pathname.includes("following")) {
      setFollowingOpen(true);
    }
    fetchFollowing();
    fetchFollowers();
  }, [userInfo]);

  useEffect(() => {
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
      });
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

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h4"
            sx={{
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {username}
          </Typography>
          {currentUser.displayName !== username && (
            <Button
              onClick={followUser}
              variant={
                userInfo.followers?.includes(currentUser.uid)
                  ? "outlined"
                  : "contained"
              }
            >
              {userInfo.followers?.includes(currentUser.uid)
                ? "Following"
                : "Follow"}
            </Button>
          )}
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
          <Typography variant="p" component="h4">
            <Link
              style={{
                textDecoration: "none",
                cursor: userInfo.followers?.length > 0 ? "pointer" : "default",
                color: userInfo.followers?.length > 0 ? "inherit" : "gray",
              }}
              to={
                userInfo.followers?.length > 0
                  ? `/profile/${username}/followers`
                  : undefined
              }
              onClick={
                userInfo.followers?.length > 0
                  ? () => setFollowersOpen(true)
                  : undefined
              }
            >
              {userInfo.followers?.length || 0} Followers
            </Link>
          </Typography>
          <Typography variant="p" component="h4">
            <Link
              style={{
                textDecoration: "none",
                cursor: userInfo.following?.length > 0 ? "pointer" : "default",
                color: userInfo.following?.length > 0 ? "inherit" : "gray",
              }}
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
              {userInfo.following?.length || 0} Following
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
          {followers?.map((follower) => (
            <Typography
              variant="p"
              component="h4"
              key={follower}
              onClick={() => {
                setFollowersOpen(false);
              }}
            >
              <Link to={`/profile/${follower.username}`}>
                {follower.username}
              </Link>
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
          {!following ? <CircularProgress /> : null}
          {following?.map((follower) => (
            <Typography
              variant="p"
              component="h4"
              key={follower}
              onClick={() => {
                setFollowingOpen(false);
              }}
            >
              <Link
                to={`/profile/${follower.username}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {follower.username}
              </Link>
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
          {/* {isloading && <Skeleton variant="rectangular" width={300} height={300} />} */}
          {userRecipes.map((recipe) => (
            <Grid item key={recipe.id}>
              {<RecipeCard {...recipe} />}
            </Grid>
          ))}
        </Box>
      </Container>
    </>
  );
};
