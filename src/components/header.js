import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";
export const Header = () => {
  const currentUser = useContext(UserContext);
  return (
    <div>
      <h1>Recipe App! 👨‍🍳</h1>
      <Link to="/recipes">Recipes</Link> |{" "}
      <Link to="/new-recipe">Add Recipe</Link> |{" "}
      <Link to={`/profile/${currentUser.displayName}`}>Profile</Link> |{" "}
      <Link to="/settings">Settings</Link>
    </div>
  );
};
