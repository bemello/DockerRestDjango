import { Link } from "react-router-dom";

function Footer({ user }) {
  return (
    <div className="footer-container">
      <div className="website-info">
        <div className="brand-logo">
          <span className="material-icons-outlined">menu_book</span>
          <span className="brand-name">Recipe Book</span>
        </div>
        <p className="brand-description">
          Your digital kitchen companion. Organize and find the recipes that
          bring joy to your table.
        </p>
        <div className="social-links">
          <a href="#">
            <span className="material-icons-outlined">facebook</span>
          </a>
          <a href="#">
            <span className="material-icons-outlined">camera_alt</span>
          </a>
          <a href="#">
            <span className="material-icons-outlined">alternate_email</span>
          </a>
        </div>
      </div>
      <div className="quick-links navigation-links">
        <h4>Quick Links</h4>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/recipes">Recipes</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/recipe/new">Create Recipe</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="support navigation-links">
        <h4>Support</h4>
        <ul>
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms of Service</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
