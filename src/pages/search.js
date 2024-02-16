import { Box, Container } from "@mui/material";
import { SearchBar } from "../components/searchbar";

export const Search = () => {
  return (
    <>
      <>
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Box
            padding={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
            }}
          >
            <SearchBar />
          </Box>
        </Container>
      </>
    </>
  );
};
