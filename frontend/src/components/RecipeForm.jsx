import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function RecipeForm({ recipe }) {
  const navigate = useNavigate();
  const isPersisted = recipe != null;
  const [loading, setLoading] = useState(false);
  const [changedFields, setChangedFields] = useState(new Map());

  const addChangedField = (e) => {
    if (e.target.id === "time_minutes") {
      setChangedFields(changedFields.set(e.target.id, e.target.value * 60));
    } else {
      setChangedFields(changedFields.set(e.target.id, e.target.value));
    }
  };

  const [title, setTitle] = useState(() => {
    if (isPersisted) {
      return recipe.title;
    }
    return "";
  });

  const [description, setDescription] = useState(() => {
    if (isPersisted) {
      return recipe.description;
    }
    return "";
  });

  const [instructions, setInstructions] = useState(() => {
    if (isPersisted) {
      return recipe.instructions;
    }
    return "";
  });

  const [servings, setServings] = useState(() => {
    if (isPersisted) {
      return recipe.servings;
    }
    return 1;
  });

  const [price, setPrice] = useState(() => {
    if (isPersisted) {
      return recipe.price;
    }
    return 0.0;
  });

  const [time, setTime] = useState(() => {
    if (isPersisted) {
      return recipe.time_minutes / 60;
    }
    return 1;
  });

  const [url, setUrl] = useState(() => {
    if (isPersisted) {
      return recipe.link;
    }
  });

  const [ingredients, setIngredients] = useState(() => {
    if (isPersisted) {
      const res = [];
      recipe.ingredients.forEach((el) => {
        res.push({
          name: el.name,
        });
      });
      return res;
    }
    return new Array();
  });

  const [tags, setTags] = useState(() => {
    if (isPersisted) {
      const res = [];
      recipe.tags.forEach((el) => {
        res.push({
          name: el.name,
        });
      });
      return res;
    }
    return new Array();
  });

  function addNewIngredient() {
    if (ingredient && !ingredients.includes({ name: ingredient })) {
      ingredients.push({ name: ingredient });
      setIngredients(ingredients);
      setChangedFields(changedFields.set("ingredients", ingredients));
    }
    setIngredient("");
  }

  function addNewTag() {
    if (tag && !tags.includes({ name: tag })) {
      tags.push({ name: tag });
      setTags(tags);
      setChangedFields(changedFields.set("tags", tags));
    }
    setTag("");
  }

  const removeIngredient = (e) => {
    setIngredients((existingIngredients) => {
      const res = existingIngredients.filter((item) => item.name !== e);
      setChangedFields(changedFields.set("ingredients", res));
      return res;
    });
  };

  const removeTag = (e) => {
    setTags((existingTags) => {
      const res = existingTags.filter((item) => item.name !== e);
      setChangedFields(changedFields.set("tags", res));
      return res;
    });
  };

  const [ingredient, setIngredient] = useState("");
  const [tag, setTag] = useState("");

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (isPersisted) {
        const res = await api.patch(
          "/api/recipe/recipes/" + recipe.id + "/",
          JSON.stringify(Object.fromEntries(changedFields)),
          { headers: { "content-type": "application/json" } },
        );
        navigate("/");
      } else {
        const res = await api.post(
          "api/recipe/recipes/",
          {
            title: title,
            description: description,
            price: price,
            time_minutes: time * 60,
            link: url,
          },
          { headers: { "content-type": "application/json" } },
        );
        navigate("/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="w-50">
        <div className="recipe-form default-form">
          <form onSubmit={handleSubmit} id="form" method="post">
            <div className="mb-3 mt-3">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                className="form-control"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                className="form-control"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="instructions">Instructions</label>
              <textarea
                id="instructions"
                className="form-control"
                rows="10"
                value={instructions}
                onChange={(e) => {
                  setInstructions(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-currency-euro"></i>
              </span>
              <span className="input-group-text input-group-range">
                <output
                  htmlFor="price"
                  id="price_range_value"
                  aria-hidden="true"
                >
                  {price}
                </output>
              </span>
              <input
                id="price"
                className="form-range custom-range border-0 align-middle"
                type="range"
                step="0.05"
                min="0.00"
                max="50.00"
                value={price}
                onChange={(e) => {
                  price_range_value.value = parseFloat(e.target.value).toFixed(
                    2,
                  );
                  setPrice(parseFloat(e.target.value).toFixed(2));
                  addChangedField(e);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-clock"></i>
              </span>
              <span className="input-group-text input-group-range">
                <output
                  htmlFor="time_minutes"
                  id="time_range_value"
                  aria-hidden="true"
                >
                  {time}h
                </output>
              </span>
              <input
                id="time_minutes"
                className="form-range custom-range border-0 align-middle"
                type="range"
                step="0.5"
                min="0.5"
                max="8"
                value={time}
                onChange={(e) => {
                  time_range_value.value = e.target.value + "h";
                  setTime(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <i className="bi bi-people"></i>
              </span>
              <span className="input-group-text input-group-range">
                <output
                  htmlFor="servings"
                  id="servings_range_value"
                  aria-hidden="true"
                >
                  {servings}
                </output>
              </span>
              <input
                id="servings"
                className="form-range custom-range border-0 align-middle"
                type="range"
                step="1"
                min="1"
                max="10"
                value={servings}
                onChange={(e) => {
                  servings_range_value.value = e.target.value;
                  setServings(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="link">Link</label>
              <input
                id="link"
                className="form-control"
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
            <span className="mt-3">
              Ingredients <em>(Click an ingredient to remove it)</em>
            </span>
            <div className="row row-cols-auto p-1">
              {ingredients.map((ing, index) => (
                <div className="col" key={index}>
                  <span
                    id={ing.name + "_ing"}
                    className="mb-1 badge"
                    key={index}
                    onClick={() => {
                      removeIngredient(ing.name);
                    }}
                  >
                    {ing.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="input-group mb-3 mt-0">
              <input
                id="ingredient"
                className="form-control"
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
              />
              <button
                className="btn btn-default"
                type="button"
                id="add_ingredient"
                onClick={() => addNewIngredient()}
              >
                Add
              </button>
            </div>
            <span className="mt-3">
              Tags <em>(Click a tag to remove it)</em>
            </span>
            <div className="row row-cols-auto p-1">
              {tags.map((t, index) => (
                <div className="col" key={index}>
                  <span
                    id={t.name + "_tag"}
                    className="mb-1 badge"
                    key={index}
                    onClick={() => {
                      removeTag(t.name);
                    }}
                  >
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="input-group mb-3 mt-0">
              <input
                id="tag"
                className="form-control"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <button
                className="btn btn-default"
                type="button"
                id="add_tag"
                onClick={() => addNewTag()}
              >
                Add
              </button>
            </div>
          </form>
          <button type="submit" form="form" className="btn btn-default me-2">
            Save Recipe
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <div className="d-grid gap-2"></div>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm;
