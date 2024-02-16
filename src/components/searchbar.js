import { Box, Button, Container, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

export const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  //search for users
  //search for recipes
  //search for tags

  return (
    <>
      <Container container spacing={1} alignItems="center">
        <Box component={"form"}>
          <TextField
            id="input-with-icon-grid"
            label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button>
            <IconButton color="primary" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Button>
        </Box>
        {searchValue}
      </Container>
    </>
  );
};
