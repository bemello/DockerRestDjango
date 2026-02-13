import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import RecipeList from "../components/RecipeList";

function Recipes() {
  const TAG_ID_SUFFIX = "_tag_id";
  const INGREDIENT_ID_SUFFIX = "_ing_id";
  const TAG_TYPE = "tag-item";
  const INGREDIENT_TYPE = "ingredient-item";

  const { state } = useLocation();
  const stateTag = state ? state.tag : null;
  const [recipes, setRecipes] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Map());
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    getRecipes();
    getTags();
    getIngredients();
  }, []);

  const getRecipes = () => {
    api
      .get("/api/recipe/recipes")
      .then((res) => res.data)
      .then((data) => handleSetRecipes(data))
      .catch((err) => alert("getRecipes(): " + err));
  };

  function handleSetRecipes(data) {
    setRecipes(data);
    handleFiltering(
      data,
      selectedItems,
      stateTag ? stateTag.id + TAG_ID_SUFFIX : null,
    );
    window.history.replaceState({}, "");
  }

  const getTags = () => {
    api
      .get("/api/recipe/tags", { params: { assigned_only: 1 } })
      .then((res) => res.data)
      .then((data) => handleTags(data))
      .catch((err) => alert("getTags(): " + err));
  };

  function handleTags(data) {
    let res = [];
    data.forEach(function (tag) {
      const is_checked = stateTag && tag.id == stateTag.id;
      res.push({
        id: tag.id,
        name: tag.name,
        tag_recipes: tag.tag_recipes,
        checked: is_checked,
      });
      if (is_checked) {
        setSelectedItems(
          selectedItems.set(tag.id + TAG_ID_SUFFIX, {
            type: TAG_TYPE,
            name: tag.name,
          }),
        );
      }
    });
    setTags(res);
  }

  const getIngredients = () => {
    api
      .get("/api/recipe/ingredients", { params: { assigned_only: 1 } })
      .then((res) => res.data)
      .then((data) => setIngredients(data))
      .catch((err) => alert("getIngredients(): " + err));
  };

  const handleItemSelection = (e) => {
    const elementId = e.target.id;
    const element_name = e.target.value;
    const is_checked = e.target.checked;
    const element_type = e.target.className;

    if (is_checked) {
      setSelectedItems(
        selectedItems.set(elementId, {
          type: element_type,
          name: element_name,
        }),
      );
    } else {
      e.target.checked = false;
      selectedItems.delete(elementId);
    }

    handleFiltering(recipes, selectedItems);
  };

  function handleFiltering(data, items) {
    if (items.size == 0) {
      setFilteredRecipes(data);
    } else {
      let selectedTags = [];
      let selectedIngredients = [];

      items.forEach(function (value, key) {
        value.type == TAG_TYPE
          ? selectedTags.push(value.name)
          : selectedIngredients.push(value.name);
      });

      const filtered_objects = data.filter((recipe) => {
        const includesIngredients = includesAll(
          recipe.ingredients.map((obj) => obj.name),
          selectedIngredients,
        );
        const includesTags = includesAll(
          recipe.tags.map((obj) => obj.name),
          selectedTags,
        );
        return includesIngredients && includesTags;
      });

      setFilteredRecipes(filtered_objects);
    }
  }

  function includesAll(arr, subArr) {
    for (let item of subArr) {
      if (!arr.includes(item)) return false;
    }
    return true;
  }

  return (
    <>
      <section className="container py-5">
        <div className="d-flex">
          <div className="filter w-25">
            <h2 className="mb-4">
              <span className="fw-bold">Filter</span>
            </h2>
            <h5
              className="fw-bold mt-3 filter-header"
              data-bs-toggle="collapse"
              data-bs-target="#ingredients"
            >
              Ingredients<i className="bi bi-chevron-expand ms-1"></i>
            </h5>
            <div className="ingredients-list collapse show" id="ingredients">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id}>
                  <input
                    type="checkbox"
                    className={INGREDIENT_TYPE}
                    value={ingredient.name}
                    id={ingredient.id + INGREDIENT_ID_SUFFIX}
                    key={ingredient.id}
                    onChange={(e) => handleItemSelection(e)}
                  />
                  <label
                    htmlFor={ingredient.id + INGREDIENT_ID_SUFFIX}
                    className="ms-1"
                  >
                    {ingredient.name}
                  </label>
                  <br />
                </div>
              ))}
            </div>
            {tags ? (
              <>
                <h5
                  className="fw-bold mt-3 filter-header"
                  data-bs-toggle="collapse"
                  data-bs-target="#tags"
                >
                  Tags<i className="bi bi-chevron-expand ms-1"></i>
                </h5>
                <div className="tags-list collapse show" id="tags">
                  {tags.map((tag) => (
                    <div key={tag.id}>
                      <input
                        type="checkbox"
                        className={TAG_TYPE}
                        value={tag.name}
                        defaultChecked={tag.checked}
                        id={tag.id + TAG_ID_SUFFIX}
                        key={tag.id}
                        onChange={(e) => {
                          handleItemSelection(e);
                        }}
                      />
                      <label htmlFor={tag.id + TAG_ID_SUFFIX} className="ms-1">
                        {tag.name}
                      </label>
                      <br />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="flex-grow-1">
            <h2 className="mb-4">
              <span className="fw-bold">Recipes</span>
            </h2>
            <div className="row">
              {filteredRecipes.map((recipe) => (
                <RecipeList recipe={recipe} key={recipe.id} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Recipes;
