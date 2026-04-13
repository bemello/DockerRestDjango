import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import Recipes from "./pages/Recipes";
import CreateRecipe from "./pages/CreateRecipe";
import UpdateRecipe from "./pages/UpdateRecipe";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import api from "./utils/api";
import { USER_SESSION } from "./utils/constants";
import ScrollToTop from "./utils/scrollToTop";

function Logout({ setUser }) {
  localStorage.clear();
  setUser(null);
  return <LandingPage />;
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

  function Layout() {
    return (
      <div className="wrapper">
        <ScrollToTop />
        <Navbar user={user} />
        <main>
          <Outlet />
        </main>
        <footer className="footer">
          <Footer user={user} />
        </footer>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: user ? <Home /> : <LandingPage />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recipes",
          element: <Recipes />,
        },
        {
          path: "/recipe/new",
          element: (
            <ProtectedRoute>
              <CreateRecipe />
            </ProtectedRoute>
          ),
        },
        {
          path: "/recipe/:id",
          loader: async ({ params }) => {
            const res = await api.get(`/api/recipe/recipes/${params.id}/`);
            return res.data;
          },
          element: <Recipe />,
        },
        {
          path: "/recipe/:id/edit",
          loader: async ({ params }) => {
            const res = await api.get(`/api/recipe/recipes/${params.id}/`);
            return res.data;
          },
          element: (
            <ProtectedRoute>
              <UpdateRecipe />
            </ProtectedRoute>
          ),
        },
        {
          path: "/login",
          element: <Login setUser={setUser} />,
        },
        {
          path: "/logout",
          element: <Logout setUser={setUser} />,
        },
        {
          path: "/register",
          element: <RegisterAndLogout />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
