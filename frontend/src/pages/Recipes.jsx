import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeightAnimation } from "../components/HeightAnimation";

import api from "../utils/api";
import RecipeList from "../components/RecipeList";

function Recipes() {
  const DISPLAY_LIMIT = 9;

  const { state } = useLocation();
  const stateTitle = state ? state.filteredTitle : null;
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [ingredient, setIngredient] = useState("");
  const [ingredientSearchResult, setIngredientSearchResult] = useState([]);
  const [tag, setTag] = useState("");
  const [tagSearchResult, setTagSearchResult] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [category, setCategory] = useState("");

  const [recipes, setRecipes] = useState(() => {
    getRecipes(
      stateTitle ? stateTitle : undefined,
      undefined,
      undefined,
      offset,
      false,
    );
  });

  function getRecipes(title, ingredients, tags, offset, isLoadMore) {
    setLoading(true);
    api
      .get("/api/recipe/recipes", {
        params: {
          title: title ? title : undefined,
          ingredients: ingredients ? ingredients.toString() : undefined,
          tags: tags ? tags.toString() : undefined,
          limit: DISPLAY_LIMIT,
          offset: offset,
        },
      })
      .then((res) => {
        setHasMore(res.data.length == DISPLAY_LIMIT);
        return res.data;
      })
      .then((data) => handleRecipes(data, isLoadMore))
      .catch((err) => console.log("getRecipes(): " + err))
      .finally(() => {
        setLoading(false);
        window.history.replaceState({}, "");
      });
  }

  const [title, setTitle] = useState(() => {
    return stateTitle ? stateTitle : "";
  });

  const [tags, setTags] = useState(() => {
    api
      .get("/api/recipe/tags", { params: { assigned_only: 1 } })
      .then((res) => res.data)
      .then((data) => setTags(data))
      .catch((err) => console.log("getTags(): " + err));
  });

  const [ingredients, setIngredients] = useState(() => {
    api
      .get("/api/recipe/ingredients", { params: { assigned_only: 1 } })
      .then((res) => res.data)
      .then((data) => setIngredients(data))
      .catch((err) => console.log("getIngredients(): " + err));
  });

  const [categories, setCategories] = useState(() => {
    api.get("api/recipe/categories/").then((res) => setCategories(res.data));
  });

  function handleRecipes(data, isLoadMore) {
    if (isLoadMore) {
      setFilteredRecipes((prev) => {
        return [...prev, ...data];
      });
    } else {
      setFilteredRecipes(data);
    }
  }

  function handleFiltering() {
    setOffset(0);
    getRecipes(
      title,
      selectedIngredients.map((ing) => ing.id),
      selectedTags.map((obj) => obj.id),
      0,
      false,
    );
  }

  const handleSort = (e) => {
    if (e.target.value === "id") {
      setFilteredRecipes(filteredRecipes.toSorted((a, b) => b.id - a.id));
    } else if (e.target.value === "name") {
      setFilteredRecipes(
        filteredRecipes.toSorted((a, b) => a.title.localeCompare(b.title)),
      );
    } else if (e.target.value === "time") {
      setFilteredRecipes(
        filteredRecipes.toSorted((a, b) => a.time_minutes - b.time_minutes),
      );
    } else if (e.target.value === "price") {
      setFilteredRecipes(
        filteredRecipes.toSorted((a, b) => a.price - b.price),
      );
    }
  };

  function handleClearFilters() {
    setTitle("");
    setCategory("");
    setIngredient("");
    setTag("");
    setSelectedIngredients([]);
    setSelectedTags([]);
  }

  function handleResetFilters() {
    handleClearFilters();
    setSelectedIngredients([]);
    setSelectedTags([]);
    setOffset(0);
    setTitle("");
    getRecipes(undefined, undefined, undefined, undefined, false);
  }

  const loadMoreOnClick = () => {
    if (loading) return;
    getRecipes(
      title,
      selectedIngredients,
      selectedTags,
      offset + DISPLAY_LIMIT,
      true,
    );
    setOffset(offset + DISPLAY_LIMIT);
  };

  function handleSelection(ingredient, tag) {
    if (ingredient) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setIngredient("");
      setIngredientSearchResult([]);
    }
    if (tag) {
      setSelectedTags([...selectedTags, tag]);
      setTag("");
      setTagSearchResult([]);
    }
  }

  function clearSelection(ingredient, tag) {
    if (ingredient) {
      setSelectedIngredients(
        selectedIngredients.filter((ing) => ing.id !== ingredient.id),
      );
    }
    if (tag) {
      setSelectedTags(selectedTags.filter((obj) => obj.id !== tag.id));
    }
  }

  useEffect(() => {
    const tagSearch = document.getElementById("tag-search");
    const ingredientSearch = document.getElementById("ingredient-search");

    if (ingredient.trim() === "") {
      setIngredientSearchResult([]);
    }
    if (ingredient.length >= 2) {
      const filtered_ingredients = ingredients.filter((ing) =>
        ing.name.toLowerCase().includes(ingredient.toLowerCase()),
      );
      setIngredientSearchResult(filtered_ingredients);
    }
    if (tag.trim() === "") {
      setTagSearchResult([]);
    }
    if (tag.length >= 2) {
      const filtered_tags = tags.filter((obj) =>
        obj.name.toLowerCase().includes(tag.toLowerCase()),
      );
      setTagSearchResult(filtered_tags);
    }
  }, [ingredient, tag]);

  return (
    <section className="recipes-container">
      <aside className="filter-panel">
        <div className="panel-container">
          <section className="panel-header">
            <h2>
              <span className="material-icons">tune</span> Filters
            </h2>
            <button onClick={handleClearFilters}>Clear All</button>
          </section>
          <section className="panel-section">
            <h3>Title</h3>
            <input
              type="text"
              placeholder="e.g. Carbonara"
              id="recipe-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>

          <section className="panel-section">
            <h3>Category</h3>
            <select
              id="category"
              className="no-checkmark"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                addChangedField(e);
              }}
            >
              <button className="select-button">
                <div>
                  <selectedcontent></selectedcontent>
                </div>
              </button>
              <div>
                <option value="">Select a Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.name}>
                    <div className="custom-option">
                      <span className="option-text">{category.name}</span>
                    </div>
                  </option>
                ))}
              </div>
            </select>
          </section>

          <section className="panel-section">
            <h3>Ingredients</h3>
            <div className="ingredients-container dropdown-search-container">
              <input
                type="text"
                placeholder="e.g. Cabbage"
                className="search-input"
                id="ingredient-search"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              />
              <div className="results-container">
                <HeightAnimation>
                  <div className="results">
                    {ingredient.length >= 2 && (
                      <>
                        {ingredientSearchResult.map((ingredient) => (
                          <div
                            onClick={() => handleSelection(ingredient)}
                            key={ingredient.id}
                            className="results-item"
                          >
                            <p>{ingredient.name}</p>
                          </div>
                        ))}
                        {ingredientSearchResult.length === 0 && (
                          <div className="results-item not-found">
                            <div>
                              <span>No ingredients found</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </HeightAnimation>
              </div>
            </div>
            <div className="selected-items-container">
              {selectedIngredients.map((ingredient) => (
                <div key={ingredient.id} className="selected-item">
                  <div>{ingredient.name}</div>
                  <span
                    onClick={() => clearSelection(ingredient, null)}
                    className="material-symbols-outlined"
                  >
                    close
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-section">
            <h3>Tags</h3>
            <div className="tags-container dropdown-search-container">
              <input
                type="text"
                placeholder="e.g. Vegan"
                className="search-input"
                id="tag-search"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <div className="results-container">
                <HeightAnimation>
                  <div className="results">
                    {tag.length >= 2 && (
                      <>
                        {tagSearchResult.map((tag) => (
                          <div
                            onClick={() => handleSelection(null, tag)}
                            key={tag.id}
                            className="results-item"
                          >
                            <p>{tag.name}</p>
                          </div>
                        ))}
                        {tagSearchResult.length === 0 && (
                          <div className="results-item not-found">
                            <div>
                              <span>No tags found</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </HeightAnimation>
              </div>
            </div>
            <div className="selected-items-container">
              {selectedTags.map((tag) => (
                <div key={tag.id} className="selected-item">
                  <div>{tag.name}</div>
                  <span
                    onClick={() => clearSelection(null, tag)}
                    className="material-symbols-outlined"
                  >
                    close
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-footer">
            <button
              onClick={handleFiltering}
              className="text-xs font-600 text-accent hover:bg-accent hover:text-white border border-accent transition-colors rounded-xl px-2 py-1 uppercase tracking-wider"
            >
              Apply Filters
            </button>
            <button
              disabled={
                selectedIngredients.length == 0 &&
                selectedTags.length == 0 &&
                title.length == 0 &&
                category.length == 0
              }
              onClick={handleResetFilters}
              className="text-xs font-600 text-accent hover:bg-accent hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent border border-accent transition-colors rounded-xl px-2 py-1 uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </section>
        </div>
      </aside>
      <section className="flex-1 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
          <p className="text-info text-md">
            Showing {filteredRecipes ? filteredRecipes.length : 0}{" "}
            {filteredRecipes.length != 1 ? "recipes" : "recipe"} for your
            selection
          </p>
          <div className="flex items-center gap-3">
            <span className="text-md font-600 text-info whitespace-nowrap">
              Sort by:
            </span>
            <select
              onChange={(e) => handleSort(e)}
              className="filter-selection"
            >
              <button className="select-button">
                <div>
                  <selectedcontent></selectedcontent>
                </div>
              </button>
              <div>
                <option value="id">
                  <div className="custom-option">
                    <span className="option-text">Most Recent</span>
                  </div>
                </option>
                <option value="name">
                  <div className="custom-option">
                    <span className="option-text">Title</span>
                  </div>
                </option>
                <option value="time">
                  <div className="custom-option">
                    <span className="option-text">Prep Time</span>
                  </div>
                </option>
                <option value="price">
                  <div className="custom-option">
                    <span className="option-text">Price</span>
                  </div>
                </option>
              </div>
            </select>
          </div>
        </div>
        <div className="recipes-grid">
          {filteredRecipes ? (
            filteredRecipes.map((recipe) => (
              <RecipeList recipe={recipe} key={recipe.id} />
            ))
          ) : (
            <></>
          )}
        </div>
        {hasMore && (
          <button
            onClick={loadMoreOnClick}
            className="flex justify-center mx-auto mt-6 py-2 px-4 rounded-lg bg-primary hover:bg-primary/80 transition-colors shadow-lg shadow-accent/20 text-white font-600"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </section>
    </section>
  );
}

export default Recipes;
