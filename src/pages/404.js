import { useEffect } from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Not Found";
  }, []);
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Link to="/home">Go Home</Link>
    </div>
  );
};
