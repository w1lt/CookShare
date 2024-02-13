import { useState, createContext } from "react";
import "./App.css";
import { WelcomePage } from "./components/welcomePage";
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

export const UserContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState([]);

  auth.onAuthStateChanged((user) => {
    setCurrentUser(user);
  });

  return (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <Router>
          {currentUser ? <Header /> : null}
          <Routes>
            <Route path="/login" element={<WelcomePage />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/new-recipe" element={<RecipeForm />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/Error404" element={<NotFound />} />
            <Route path={"user"}>
              <Route path=":userId" element={<ProfilePage />} />
            </Route>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/*" element={<Navigate to={"/Error404"} />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
