import { Container, Divider } from "@mui/material";
export const Footer = () => {
  return (
    <>
      <Container
        sx={{
          paddingTop: 10,
        }}
      >
        <footer>
          <Divider />
          <p style={{ textAlign: "center" }}>
            &copy; {new Date().getFullYear()} CookShare, All Rights Reserved
          </p>
        </footer>
      </Container>
    </>
  );
};
