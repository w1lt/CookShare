import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export const Wrapper = ({ children }) => {
  const theme = useTheme();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
    setFadeIn(true);

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, [theme]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
      on
    >
      <Header />
      <div style={{ flex: "1", opacity: 1 }}>{children}</div>
      <Footer />
    </div>
  );
};
