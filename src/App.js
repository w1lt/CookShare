import { useState, createContext } from "react";
import { Auth } from "./pages/auth";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { RecipeForm } from "./components/recipeForm";
import { UserSettings } from "./pages/userSettings";
import { auth } from "./config/firebase";
import { NotFound } from "./pages/404";
import { ProfilePage } from "./pages/profile";
import { RecipePost } from "./pages/recipePost";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Search } from "./pages/search";
import { Home } from "./pages/home";
import { Wrapper } from "./pages/wrapper";

export const UserContext = createContext();
export const ThemeContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      return storedDarkMode === "true";
    } else {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
  });

  auth.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });

  auth.onIdTokenChanged((user) => {
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
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#2196f3",
      },
    },
  });

  return (
    <div style={{ textAlign: "center" }}>
      <ThemeProvider theme={THEME}>
        <UserContext.Provider value={currentUser}>
          <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            <Router>
              <Wrapper>
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
                      <Route path="followers" element={<ProfilePage />} />
                      <Route path="following" element={<ProfilePage />} />
                    </Route>
                  </Route>
                  <Route path="/" element={<Auth />} />
                  <Route path="/*" element={<Navigate to={"/Error404"} />} />
                </Routes>
              </Wrapper>
            </Router>
          </ThemeContext.Provider>
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
