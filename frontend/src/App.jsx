import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import UpdateRecipe from "./pages/UpdateRecipe";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/fonts.css";
import "./styles/style.css";
import { USER_SESSION } from "./utils/constants";

function Logout({ setUser }) {
  localStorage.clear();
  setUser(null);
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem(USER_SESSION));
  });

  useEffect(() => {
    if (user != null) {
      localStorage.setItem(USER_SESSION, JSON.stringify(user));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe"
          element={
            <ProtectedRoute>
              <Recipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/new"
          element={
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/edit"
          element={
            <ProtectedRoute>
              <UpdateRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/logout" element={<Logout setUser={setUser} />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
