import { useState, createContext } from "react";
import "./App.css";
import { WelcomePage } from "./components/welcomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Recipes } from "./components/recipes";
import { RecipeForm } from "./components/recipeForm";
import { Header } from "./components/header";
import { UserSettings } from "./pages/userSettings";
import { auth } from "./config/firebase";

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
            <Route path="/" element={<WelcomePage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
