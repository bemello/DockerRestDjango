import { Link } from "react-router-dom";

function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg shadow outfit-w500">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold style-script-regular">
          Recipe Book
        </Link>
        <div className="collapse navbar-collapse show">
          {user ? (
            <>
              <ul className="navbar-nav ms-auto align-items-center gap-3">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipes" className="nav-link">
                    Recipes
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="dropdown">
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src={user ? user.profile_picture : "anything"}
                        alt="User"
                        className="rounded-circle"
                        width="40"
                        height="40"
                      />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/profile" className="dropdown-item">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/recipe/new" className="dropdown-item">
                          Add Recipe
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/logout"
                          className="dropdown-item text-danger"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </>
          ) : (
            <>
              <ul className="navbar-nav justify-content-end">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Sign up
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
