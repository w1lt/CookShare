import { useState } from "react";
import "./App.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WelcomePage } from "./components/welcomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Recipes } from "./components/recipes";
import { RecipeForm } from "./components/recipeForm";
import { Header } from "./components/header";
import { UserSettings } from "./pages/userSettings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <div className="App">
      <Router>
        {isLoggedIn ? <Header /> : null}
        <Routes>
          <Route path="/login" element={<WelcomePage />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/new-recipe" element={<RecipeForm />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/" element={<WelcomePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
