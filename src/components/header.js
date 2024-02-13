import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";
export const Header = () => {
  const currentUser = useContext(UserContext);
  return (
    <div>
      <h1>Recipe App! 👨‍🍳</h1>
      <Link style={{ textDecoration: "none", color: "black" }} to="/recipes">
        Recipes
      </Link>{" "}
      |{" "}
      <Link style={{ textDecoration: "none", color: "black" }} to="/new-recipe">
        Add Recipe
      </Link>{" "}
      |{" "}
      <Link
        style={{ textDecoration: "none", color: "black" }}
        to={`/profile/${currentUser.displayName}`}
      >
        Profile
      </Link>{" "}
      |{" "}
      <Link style={{ textDecoration: "none", color: "black" }} to="/settings">
        Settings
      </Link>
    </div>
  );
};
