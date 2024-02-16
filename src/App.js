import { useState, createContext } from "react";
import { Auth } from "./pages/auth";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Recipes } from "./components/recipes";
import { RecipeForm } from "./components/recipeForm";
import { Header } from "./components/header";
import { UserSettings } from "./pages/userSettings";
import { auth } from "./config/firebase";
import { NotFound } from "./pages/404";
import { ProfilePage } from "./pages/profile";
import { RecipePost } from "./pages/recipePost";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Search } from "./pages/search";
import { Home } from "./pages/home";

export const UserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState([]);

  auth.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });

  const THEME = createTheme({
    typography: {
      fontFamily: ` "apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",`,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
  });
  return (
    <div style={{ textAlign: "center" }}>
      <ThemeProvider theme={THEME}>
        <UserContext.Provider value={currentUser}>
          <Router>
            <Header />
            <Routes>
              <Route path="/auth" element={<Auth />}>
                <Route path=":loginType" element={<Auth />} />
              </Route>
              <Route path="/home" element={<Home />} />
              <Route path="/recipes/">
                <Route path=":id" element={<RecipePost />} />
              </Route>
              <Route path="/new-recipe" element={<RecipeForm />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<UserSettings />} />
              <Route path="/Error404" element={<NotFound />} />
              <Route path="profile">
                <Route path=":username" element={<ProfilePage />}>
                  <Route
                    path="followers"
                    element={<ProfilePage showFollowers={true} />}
                  />
                </Route>
              </Route>
              <Route path="/" element={<Auth />} />
              <Route path="/*" element={<Navigate to={"/Error404"} />} />
            </Routes>
          </Router>
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
