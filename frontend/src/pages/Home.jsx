import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HeightAnimation } from "../components/HeightAnimation";

import api from "../utils/api";
import RecipeList from "../components/RecipeList";

function Home() {
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
    <>
      <section className="max-w-4xl mx-auto px-6 text-center relative isolate">
        <h1 className="font-display text-4xl md:text-6xl text-primary mb-6 leading-tight">
          A Personal Catalogue <br /> For All Your Recipes
        </h1>
        <p className="text-lg text-secondary mb-10 max-w-xl mx-auto">
          Find that special recipe of yours with no hassle. Organize, discover,
          and savor every meal.
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
              "search-button" + (recipeSearch.length < 3 ? " inactive" : "")
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
      </section>

      {/* <section className="featured-recipes snappy">
        <div className="featured-recipes-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl text-primary dark:text-white mb-2">
                Featured Recipes
              </h2>
              <p className="text-secondary">
                Hand-picked favourite dishes for your next meal.
              </p>
            </div>
          </div>
          <div className="carousel">
            {featuredRecipes.map((recipe) => (
              <RecipeList recipe={recipe} key={recipe.id} />
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
}

export default Home;
