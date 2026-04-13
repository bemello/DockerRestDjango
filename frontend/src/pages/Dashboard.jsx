import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";
import ProfileCard from "../components/ProfileCard";
import RecentActivity from "../components/RecentActivity";
import RecipesByCategory from "../components/RecipesByCategory";
import ManageRecipes from "../components/ManageRecipes";
import ManageIngredients from "../components/ManageIngredients";
import ManageTags from "../components/ManageTags";

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  function exitDashboard() {
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar-container">
        <ul className="sidebar">
          <li className="sidebar-item" anchor-name="--my-dashboard">
            <a href="#my-dashboard">
              <div>My Dashboard</div>
            </a>
          </li>
          <div className="sidebar-divider"></div>
          <li className="sidebar-item" anchor-name="--account">
            <a href="#account">
              <div>Account</div>
            </a>
          </li>
          <div className="sidebar-divider"></div>
          <li className="sidebar-item" anchor-name="--recipes">
            <a href="#recipes">
              <div>Recipes</div>
            </a>
          </li>
          <div className="sidebar-divider"></div>
          <li className="sidebar-item" anchor-name="--ingredients">
            <a href="#ingredients">
              <div>Ingredients</div>
            </a>
          </li>
          <div className="sidebar-divider"></div>
          <li className="sidebar-item" anchor-name="--tags">
            <a href="#tags">
              <div>Tags</div>
            </a>
          </li>
          <div className="sidebar-divider"></div>
          <li className="sidebar-item" anchor-name="--categories">
            <a href="#categories">
              <div>Categories</div>
            </a>
          </li>
        </ul>
        <div onClick={exitDashboard} className="sidebar-footer">
          <span className="material-icons-outlined">logout</span>
          <div>Exit Dashboard</div>
        </div>
      </aside>

      <section className="dashboard-content">
        <div id="my-dashboard" className="my-dashboard dashboard-tab">
          <div className="my-dashboard-box" box="profile">
            <div className="box-content">
              <ProfileCard user={user} />
            </div>
          </div>
          <div className="my-dashboard-box" box="recipes">
            <div className="box-content">
              <div className="count-container">
                <div>12</div>
                <p>
                  That's how many <span>recipes</span> you've created. Keep up
                  the inspiration and create more recipes!
                </p>
              </div>
            </div>
          </div>
          <div className="my-dashboard-box" box="ingredients">
            <div className="box-content">
              <div className="count-container">
                <div>47</div>
                <p>
                  So far you have used that amount of <span>ingredients</span>{" "}
                  on your recipes. How many others will you use?
                </p>
              </div>
            </div>
          </div>
          <div className="my-dashboard-box" box="tags">
            <div className="box-content">
              <div className="count-container">
                <div>17</div>
                <p>
                  This is the number of <span>tags</span> you came up with to
                  categorize your creations. Keep it up!
                </p>
              </div>
            </div>
          </div>
          <div className="my-dashboard-box" box="likes">
            <div className="box-content">
              <div className="count-container">
                <div>6</div>
                <p>
                  You're getting noticed! That is the total of{" "}
                  <span>likes</span> on your recipes. Keep up the good work!
                </p>
              </div>
            </div>
          </div>
          <div className="my-dashboard-box" box="activity">
            <div className="box-content">
              <div className="charts-container">
                <div className="header">
                  <span>
                    Recipes, Ingredients and Tags created in the past 7 days
                  </span>
                </div>
                <div className="chart bar-chart">
                  <RecentActivity />
                </div>
              </div>
            </div>
          </div>
          <div className="my-dashboard-box" box="recipes-by-category">
            <div className="box-content">
              <div className="charts-container">
                <div className="header">
                  <span>Recipes by Category</span>
                </div>
                <div className="chart pie-chart">
                  <RecipesByCategory />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="account" className="account-dashboard dashboard-tab">
          <div className="coming-soon">[Account] Coming soon...</div>
        </div>

        <div id="recipes" className="recipes-dashboard dashboard-tab">
          <ManageRecipes />
        </div>

        <div id="ingredients" className="ingredients-dashboard dashboard-tab">
          <div className="coming-soon">[Ingredients] Coming soon...</div>
        </div>

        <div id="tags" className="tags-dashboard dashboard-tab">
          <div className="coming-soon">[Tags] Coming soon...</div>
        </div>

        <div id="categories" className="categories-dashboard dashboard-tab">
          <div className="coming-soon">[Categories] Coming soon...</div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
