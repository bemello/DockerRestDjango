import { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

function ManageRecipes() {
  const [recipeSearch, setRecipeSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [recipes, setRecipes] = useState(() => {
    getAllRecipes();
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function getAllRecipes() {
    api
      .get("/api/recipe/recipes")
      .then((res) => {
        handleRecipes(res.data);
      })
      .catch((err) => console.log(err));
  }

  const handleSearch = (search_term) => {
    setRecipeSearch(search_term);
    if (search_term.trim() === "") {
      setSearchResult([]);
      return;
    }
    if (search_term.length >= 3) {
      const filtered_recipes = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(search_term.toLowerCase()),
      );
      setSearchResult(filtered_recipes);
    }
  };

  function handleRecipes(data) {
    setRecipes(data);
    setFeaturedRecipes(data.filter((recipe) => recipe.is_featured));
  }

  function handleSetFeaturedRecipe(recipe) {
    api
      .patch(`/api/recipe/recipes/${recipe.id}/`, {
        is_featured: !recipe.is_featured,
      })
      .then((res) => {
        setRecipeSearch("");
        setSearchResult([]);
        getAllRecipes();
      })
      .catch((err) => console.log(err));
  }

  function createEventListener() {
    const profile_page = document.getElementById("profile-page");
    profile_page.addEventListener(
      "click",
      (profile_page.fn = (e) => {
        const search_area = document.getElementById("search-results");
        if (!search_area.contains(e.target)) {
          setSearchResult([]);
          setRecipeSearch("");
          profile_page.removeEventListener("click", profile_page.fn, false);
        }
      }),
      {
        once: true,
        capture: false,
      },
    );
  }

  const handleClickDelete = () => {
    api.delete(`api/recipe/recipes/${selectedRecipe.id}/`);
    navigate("/recipes");
  };

  const handleAddImage = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await api.post(
        `api/recipe/recipes/${selectedRecipe.id}/upload-image/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      selectedRecipe.image = res.data.image;
    } catch (error) {
      console.log(error);
    }
    closeImageModal();
  };

  const handleDeleteImage = async (e) => {
    e.preventDefault();

    try {
      const res = await api.patch(
        `/api/recipe/recipes/${selectedRecipe.id}/`,
        JSON.stringify({ image: null }),
        { headers: { "content-type": "application/json" } },
      );
      selectedRecipe.image = res.data.image;
    } catch (error) {
      console.log(error);
    }
    closeDeleteImageModal();
  };

  const openDeleteModal = () => {
    document.getElementById("deleteModal").style.display = "grid";
  };

  const closeDeleteModal = () => {
    document.getElementById("deleteModal").style.display = "none";
  };

  const openDeleteImageModal = () => {
    document.getElementById("deleteImageModal").style.display = "grid";
  };

  const closeDeleteImageModal = () => {
    document.getElementById("deleteImageModal").style.display = "none";
  };

  const openImageModal = () => {
    setSelectedFile(undefined);
    document.getElementById("imageModal").style.display = "grid";
  };

  const closeImageModal = () => {
    setSelectedFile(undefined);
    document.getElementById("imageModal").style.display = "none";
  };

  return (
    <>
      {/* <div className="relative max-w-lg mx-auto mb-16">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-icons-outlined text-gray-400">search</span>
        </div>
        <input
          className="w-full pl-12 pr-4 py-2 rounded-full border-none shadow-lg focus:ring-2 focus:ring-accent bg-terracota-light dark:bg-black/20 dark:text-background-light text-gray-900 transition-all"
          placeholder="Find your next favorite recipe here..."
          type="text"
          value={recipeSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div id="search-results">
          {searchResult.length > 0 ? (
            <>
              {createEventListener()}
              <div
                className="absolute w-full mt-2 py-2 px-2 bg-terracota-light/90
                dark:bg-black/75 shadow-lg
                rounded-lg"
              >
                {searchResult.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-4 p-2 cursor-default rounded-lg transition-all"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className={
                        recipe.image
                          ? "w-12 h-12 rounded-full"
                          : "w-12 h-12 rounded-full invisible"
                      }
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-accent">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-primary dark:text-background-cream-darker">
                        {recipe.description}
                      </p>
                    </div>
                    <div
                      onClick={() => handleSetFeaturedRecipe(recipe)}
                      className={`cursor-pointer featured-icon h-7 w-7 ${recipe.is_featured ? "bg-[#d97706] hover:bg-primary/30" : "bg-primary/30 hover:bg-[#d97706]"}`}
                    ></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
          {recipeSearch.length >= 3 && searchResult.length === 0 ? (
            <>
              {createEventListener()}
              <div className="absolute w-full mt-2 px-2 py-2 bg-terracota-light/75 dark:bg-black/75 dark:text-white text-gray-900 rounded-lg shadow-lg">
                <p className="text-center text-primary dark:text-background-light">
                  No recipes found
                </p>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div> */}
      <div className="manage-recipe-container">
        {recipes?.length > 0 && (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-item">
                {/* <div
                  className="rounded-full h-15 w-15 shrink-0"
                  style={{
                    backgroundImage: `url(${recipe.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    boxShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
                  }}
                ></div> */}
                <div className="recipe-title">{recipe.title}</div>
                <div className="recipe-actions">
                  <Link to={`/recipe/${recipe.id}/edit`} className="primary">
                    <span className="material-symbols-outlined">edit</span>
                    Edit
                  </Link>
                  <button onClick={openDeleteModal} className="accent">
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                  <div
                    id="deleteModal"
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                  >
                    <div className="modal-container">
                      <main className="content">
                        <section>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="red"
                            stroke-width="1.5"
                            data-slot="icon"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <div>
                            Are you sure you want to delete this recipe? This
                            action cannot be undone.
                          </div>
                        </section>
                      </main>
                      <footer className="modal-footer end">
                        <button
                          onClick={closeDeleteModal}
                          id="cancel"
                          type="button"
                          className="btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClickDelete}
                          id="delete"
                          type="button"
                          className="btn"
                        >
                          Delete
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div
                    id="deleteImageModal"
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                  >
                    <div className="modal-container">
                      <main className="content">
                        <section>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="red"
                            stroke-width="1.5"
                            data-slot="icon"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <div>
                            Are you sure you want to remove the recipe image?
                          </div>
                        </section>
                      </main>
                      <footer className="modal-footer end">
                        <button
                          onClick={closeDeleteImageModal}
                          id="cancel"
                          type="button"
                          className="btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteImage}
                          id="delete"
                          type="button"
                          className="btn"
                        >
                          Delete
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div
                    id="imageModal"
                    className="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                  >
                    <div className="modal-container">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={closeImageModal}
                          class="-me-4 -mt-4 rounded-full text-gray-400 transition-colors hover:text-primary/30 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                          aria-label="Close"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="pb-4 text-center">
                            <p className="text-lg font-semibold text-primary dark:text-primary">
                              Select an image to set as the recipe cover
                              picture.
                            </p>
                          </div>
                          <label
                            id="image_upload_label"
                            htmlFor="image_upload_input"
                            className="cursor-pointer py-1 px-3 border border-accent/30 bg-accent/30 text-accent hover:bg-accent/40 font-bold rounded-full"
                          >
                            Choose a file
                          </label>
                          <input
                            id="image_upload_input"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAddImage}
                          />
                          {selectedFile && (
                            <div className="mt-3 flex items-center justify-center gap-2">
                              <p className="text-md font-semibold text-primary dark:text-primary pb-1">
                                Selected file: {selectedFile.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleImageSubmit}
                          id="submit"
                          type="button"
                          disabled={!selectedFile}
                          className="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageRecipes;
