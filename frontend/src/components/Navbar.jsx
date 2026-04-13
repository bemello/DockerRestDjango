import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { USER_SESSION } from "../utils/constants";

function Navbar({ user }) {
  useEffect(() => {
    if (user != null) {
      localStorage.setItem(USER_SESSION, JSON.stringify(user));
    }
  }, [user]);

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      document.getElementById("color_mode").innerHTML = "light_mode";
    } else {
      document.getElementById("color_mode").innerHTML = "dark_mode";
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand-logo">
          <span className="material-icons-outlined">menu_book</span>
          <span className="brand-name">Recipe Book</span>
        </div>
        <nav className="nav-links-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-medium text-accent hover:text-accent transition-colors border-b-2 border-accent"
                : "font-medium text-primary hover:text-accent transition-colors"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              isActive
                ? "font-medium text-accent hover:text-accent transition-colors border-b-2 border-accent"
                : "font-medium text-primary hover:text-accent transition-colors"
            }
          >
            Recipes
          </NavLink>
          {user ? (
            <NavLink
              to="/recipe/new"
              className={({ isActive }) =>
                isActive
                  ? "font-medium text-accent hover:text-accent transition-colors border-b-2 border-accent"
                  : "font-medium text-primary hover:text-accent transition-colors"
              }
            >
              Create Recipe
            </NavLink>
          ) : (
            <></>
          )}
        </nav>
        <div className="nav-links-end">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-accent hover:text-accent border-b-2 border-accent"
                    : "text-primary hover:text-accent"
                }
              >
                <span className="material-icons-outlined">dashboard</span>
              </NavLink>

              <NavLink
                to="/logout"
                className="text-primary hover:text-accent transition-colors"
              >
                <span className="material-icons-outlined">logout</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="button-colored login-btn">
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
