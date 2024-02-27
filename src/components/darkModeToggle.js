import React, { useState } from "react";
import { Button } from "@mui/material";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const handleChange = () => {
    setDarkMode((prevDarkMode) => {
      const newDarkMode = !prevDarkMode;
      localStorage.setItem("darkMode", newDarkMode);
      return newDarkMode;
    });
    window.location.reload();
  };

  return (
    <Button onClick={handleChange} variant="contained">
      Toggle {darkMode ? "Light Mode" : "Dark Mode"}
    </Button>
  );
};

export default DarkModeToggle;
