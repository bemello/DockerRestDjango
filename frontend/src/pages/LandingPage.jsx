import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../utils/api";
import { HeightAnimation } from "../components/HeightAnimation";
import Footer from "../components/Footer";
import orange_carrot from "../assets/orange-carrot.jpg";
import dashboard_image from "../assets/dashboard-ss.webp";
import recipe_image from "../assets/recipe-ss.webp";
import ramen from "../assets/ramen.jpg";
import biryani from "../assets/biryani.jpg";
import pancakes from "../assets/pancakes.jpg";
import salad from "../assets/salad.jpg";
import chef_video from "../assets/chef-video.webm";

function LandingPage() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const bgVideos = document.querySelectorAll(".video-background");

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play();
      } else {
        video.pause();
      }
    });
  };

  const observerOptions = {
    threshold: 0.01,
  };

  const videoObserver = new IntersectionObserver(
    observerCallback,
    observerOptions,
  );

  bgVideos.forEach((video) => {
    videoObserver.observe(video);
  });

  useEffect(() => {
    if (recipeSearch.trim() === "") {
      setSearchResult([]);
      return;
    }
    if (recipeSearch.length >= 3) {
      const filtered_recipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()),
      );
      setSearchResult(filtered_recipes);
    }
  }, [recipeSearch]);

  const getAllRecipes = useState(() => {
    api
      .get("/api/recipe/recipes/all-recipes/")
      .then((res) => res.data)
      .then((data) => handleRecipes(data))
      .catch((err) => console.log(err));
  });

  function handleRecipes(data) {
    let featured_recipes = [];
    data.forEach((element) => {
      element.ingredients.sort((a, b) => a.name.localeCompare(b.name));
      element.tags.sort((a, b) => a.name.localeCompare(b.name));
      element.steps.sort((a, b) => a.step_number - b.step_number);
      if (element.is_featured) {
        featured_recipes.push(element);
      }
    });
    setRecipes(data);
    setFeaturedRecipes(featured_recipes);
  }

  function handleSearch() {
    navigate("/recipes", { state: { filteredTitle: recipeSearch } });
  }

  return (
    <div className="home-container">
      <section className="hero-container snappy">
        <div className="hero">
          <div className="hero-image left">
            <img alt="Carrot" className="w-full h-full" src={orange_carrot} />
          </div>
          <div className="hero-image right">
            <img
              alt="Stir fry dish pattern"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2S7BSbvWYjIpsGbXLJ2UMC3VtQji-XURJDceD_KoXXWJNF3vT_9BpvIOdZcsB6bWZEkIsh5etuwaNhNbb33X0-_9z9E8SsJCrKBxhe28DgZ9d1fjUc5HoqcI4uK7VseHaLwF7CBnwEZzMIfaibPsms5h1IgYUCUL8KiM1HI1fu53GbWTQKq8roJjoS8Tx4szefyml7zn8oYc5QjbwztE7MKdzGwf63bPdQOZoUxywoXKYz2gICXsuMsSFSNZSgfCd-MbB-kYqseQ"
            />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center relative isolate">
            <h1 className="font-display text-4xl md:text-6xl text-primary mb-6 leading-tight">
              A Personal Catalogue <br /> For All Your Recipes
            </h1>
            <p className="text-lg text-secondary mb-10 max-w-xl mx-auto">
              Find that special recipe of yours with no hassle. Organize,
              discover, and savor every meal.
            </p>
            <div className="search-container dropdown-search-container">
              <div className="search-icon">
                <span className="material-icons-outlined">search</span>
              </div>
              <input
                className="search-input"
                placeholder="Search for recipes..."
                type="text"
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
              />
              <button
                onClick={() => handleSearch()}
                className={
                  "search-button" +
                  (recipeSearch.length < 3 ? " inactive" : "")
                }
                disabled={recipeSearch.length < 3}
              >
                Search
              </button>
              <div className="search-results-container">
                <HeightAnimation>
                  <div className="search-results">
                    {recipeSearch.length >= 3 && (
                      <>
                        {searchResult.map((recipe) => (
                          <div
                            onClick={() =>
                              navigate("/recipe", {
                                state: { recipe: recipe },
                              })
                            }
                            key={recipe.id}
                            className="search-result-item"
                          >
                            <h3>{recipe.title}</h3>
                            <p>{recipe.description}</p>
                          </div>
                        ))}
                        {searchResult.length === 0 && (
                          <div className="search-result-item not-found">
                            <div>
                              <span>No recipes found</span>
                              <span className="material-symbols-outlined">
                                sentiment_dissatisfied
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </HeightAnimation>
              </div>
            </div>
            <Link to="/recipes" className="browse-recipes">
              Browse all Recipes
              <span className="material-icons-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="home-info">
          <div className="home-info-grid">
            <div className="home-info-item">
              <div className="home-info-icon">
                <span className="material-icons-outlined">timer</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                  Quick &amp; Easy
                </h3>
                <p className="text-secondary">
                  Sleek lining minimalism for a quick and easy experience.
                </p>
              </div>
            </div>
            <div className="home-info-item">
              <div className="home-info-icon">
                <span className="material-icons-outlined">sell</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                  Categories
                </h3>
                <p className="text-secondary">
                  Clean and conveniently select categories for easy discovery.
                </p>
              </div>
            </div>
            <div className="home-info-item">
              <div className="home-info-icon">
                <span className="material-icons-outlined">filter_list</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
                  Filter
                </h3>
                <p className="text-secondary">
                  Filter through your recipes by title, ingredients or
                  categories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features snappy">
        <div className="features-container">
          <div className="bg-noise">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.dev/svgjs"
              viewBox="0 0 700 700"
              opacity="0.125"
            >
              <defs>
                <filter
                  id="nnnoise-filter"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  filterUnits="objectBoundingBox"
                  primitiveUnits="userSpaceOnUse"
                  colorInterpolationFilters="linearRGB"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.194"
                    numOctaves="4"
                    seed="15"
                    stitchTiles="stitch"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    result="turbulence"
                  ></feTurbulence>
                  <feSpecularLighting
                    surfaceScale="5"
                    specularConstant="1"
                    specularExponent="20"
                    lightingColor="#9013fe"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="turbulence"
                    result="specularLighting"
                  >
                    <feDistantLight
                      azimuth="3"
                      elevation="115"
                    ></feDistantLight>
                  </feSpecularLighting>
                  <feColorMatrix
                    type="saturate"
                    values="0"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    in="specularLighting"
                    result="colormatrix"
                  ></feColorMatrix>
                </filter>
              </defs>
              <rect width="700" height="700" fill="transparent"></rect>
              <rect
                width="700"
                height="700"
                fill="#9013fe"
                filter="url(#nnnoise-filter)"
              ></rect>
            </svg>
          </div>

          <div className="feature-grid feature-one">
            <div className="feature-header">
              <h2>Intuitive Dashboard</h2>
              <p>
                Be in control of all your recipes, ingredients, tags and more
                with a modern and easy-to-use dashboard. All important
                information in a glance.
              </p>
            </div>
            <div className="feature-image">
              <img src={dashboard_image} alt="Dashboard" />
            </div>
          </div>
          <div className="feature-grid feature-two">
            <div className="feature-image">
              <img src={recipe_image} alt="Recipe" />
            </div>
            <div className="feature-header">
              <h2>Noteworthy Recipes</h2>
              <p>
                Create your masterpiece exactly how it should be. Add your own
                recipes with all the ingredients and unique secrets, and
                categorize it as you wish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="last-section snappy">
        <video autoPlay muted playsInline className="video-background">
          <source src={chef_video} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="join-now">
          <div></div>
          <div className="main-section">
            <section className="join-now-header">
              Start cooking, chef !
            </section>
            <section className="join-now-body">
              <div>
                <span>Gain access to all features and tools.</span>
              </div>
              <div>
                <span>Join our community of home chefs and food lovers.</span>
              </div>
              <div>
                <span>
                  Share your recipes, discover new ones and unleash your inner
                  chef.
                </span>
              </div>
              <div>
                <span>Showcase your culinary skills to the world.</span>
              </div>
            </section>
            <section className="cta">
              <Link to="/register" className="button-colored">
                Sign In
              </Link>
            </section>
          </div>
          <div></div>
          <img className="polaroid top-left" src={ramen} alt="Ramen" />
          <img className="polaroid bottom-right" src={salad} alt="Salad" />
          <img className="polaroid top-right" src={biryani} alt="Biryani" />
          <img
            className="polaroid bottom-left"
            src={pancakes}
            alt="Pancakes"
          />
        </div>
        <div className="last-section-footer">
          <Footer />
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
