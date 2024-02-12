import { Link } from "react-router-dom";
import { Username } from "./username";
export const Header = () => {
  return (
    <div>
      <h1>Recipe App! 👨‍🍳</h1>
      <p>
        Welcome, <Username />!
      </p>
      <Link to="/recipes">Recipes</Link> |{" "}
      <Link to="/new-recipe">Add Recipe</Link> |{" "}
      <Link to="/settings">Settings</Link>
    </div>
  );
};
