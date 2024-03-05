import { useTheme } from "@emotion/react";
import { Container, Divider, Typography } from "@mui/material";
export const Footer = () => {
  const theme = useTheme();
  return (
    <>
      <Container
        sx={{
          paddingTop: 10,
        }}
      >
        <footer>
          <Divider />
          <Typography
            color={"textSecondary"}
            style={{ textAlign: "center" }}
            padding={2}
          >
            &copy; {new Date().getFullYear()} CookShare
          </Typography>
        </footer>
      </Container>
    </>
  );
};
