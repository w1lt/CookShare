import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export const Wrapper = ({ children }) => {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;

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
      }}
    >
      <Header />
      <div style={{ flex: "1" }}>{children}</div>
      <Footer />
    </div>
  );
};
