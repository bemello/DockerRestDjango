import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function RecipeForm({ recipe }) {
  const navigate = useNavigate();
  const isPersisted = recipe != null;
  const [loading, setLoading] = useState(false);
  const [changedFields, setChangedFields] = useState(new Map());
  const [categories, setCategories] = useState();

  useEffect(() => {
    api.get("api/recipe/categories/").then((res) => setCategories(res.data));
  }, []);

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

  const [servings, setServings] = useState(() => {
    if (isPersisted) {
      return recipe.servings;
    }
    return 1;
  });

  const [time, setTime] = useState(() => {
    if (isPersisted) {
      return recipe.time_minutes / 60;
    }
    return 1;
  });

  const [chefs_tip, setChefsTip] = useState(() => {
    if (isPersisted) {
      return recipe.chefs_tip;
    }
  });

  const [steps, setSteps] = useState(() => {
    if (isPersisted) {
      const res = [];
      recipe.steps.forEach((el) => {
        res.push({
          step_number: el.step_number,
          title: el.title,
          instruction: el.instruction,
        });
      });
      return res;
    }
    return new Array();
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

  const [category, setCategory] = useState(() => {
    if (isPersisted) {
      return recipe.category;
    }
    return "Select a Category";
  });

  function openStepsModal() {
    const modal = document.getElementById("stepsModal");
    modal.style.display = "grid";
    document.getElementById("modal-header").innerText = "Add a New Step";
    document.getElementById("save_step").innerText = "Save";
  }

  function closeStepsModal() {
    const modal = document.getElementById("stepsModal");
    modal.style.display = "none";
    setStepTitle("");
    setStepInstructions("");
  }

  function editStep(step, index) {
    setStepTitle(step.title);
    setStepInstructions(step.instruction);
    setStepIndex(index);
    const modal = document.getElementById("stepsModal");
    modal.style.display = "grid";
    document.getElementById("modal-header").innerText = "Edit This Step";
    document.getElementById("save_step").innerText = "Update";
  }

  function saveStep() {
    if (stepTitle && stepInstructions) {
      if (document.getElementById("save_step").innerText === "Save") {
        steps.push({
          step_number: steps.length + 1,
          title: stepTitle,
          instruction: stepInstructions,
        });
      } else {
        steps[stepIndex].title = stepTitle;
        steps[stepIndex].instruction = stepInstructions;
      }
      setSteps(steps);
      setChangedFields(changedFields.set("steps", steps));
    }
    closeStepsModal();
  }

  function moveStepUp(index) {
    const curr_steps = [...steps];
    const rearranged_steps = [
      ...curr_steps.slice(0, index - 1),
      ...curr_steps.splice(index, 1),
      ...curr_steps.slice(index - 1),
    ];
    rearranged_steps.forEach((el, i) => {
      el.step_number = i + 1;
    });
    setSteps(rearranged_steps);
    setChangedFields(changedFields.set("steps", rearranged_steps));
  }

  function moveStepDown(index) {
    const curr_steps = [...steps];
    const rearranged_steps = [
      ...curr_steps.slice(0, index),
      ...curr_steps.splice(index + 1, 1),
      ...curr_steps.splice(index, 1),
      ...curr_steps.slice(index),
    ];
    rearranged_steps.forEach((el, i) => {
      el.step_number = i + 1;
    });
    setSteps(rearranged_steps);
    setChangedFields(changedFields.set("steps", rearranged_steps));
  }

  function removeStep(step) {
    const updated_steps = steps.filter(
      (obj) => obj.step_number !== step.step_number,
    );
    updated_steps.forEach((el, index) => {
      el.step_number = index + 1;
    });
    setSteps(updated_steps);
    setChangedFields(changedFields.set("steps", updated_steps));
  }

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
  const [stepTitle, setStepTitle] = useState("");
  const [stepInstructions, setStepInstructions] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  const handleBack = () => {
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
        navigate(`/recipe/${recipe.id}`);
      } else {
        const res = await api.post(
          "api/recipe/recipes/",
          {
            title: title,
            description: description,
            time_minutes: time * 60,
            servings: servings,
            steps: steps,
            ingredients: ingredients,
            tags: tags,
            chefs_tip: chefs_tip,
            category: category,
          },
          { headers: { "content-type": "application/json" } },
        );
        navigate(`/recipe/${res.data.id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form">
      <div className="left-grid">
        <div className="title-category-grid">
          <div>
            <label className="recipe-field-label">Recipe Title</label>
            <input
              id="title"
              className="recipe-field"
              placeholder="Enter recipe title..."
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                addChangedField(e);
              }}
            />
          </div>
          <div>
            <label className="recipe-field-label">Category</label>
            <select
              id="category"
              className="border-radius-large height-lg"
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
                {categories?.map((category) => (
                  <option key={category.id} value={category.name}>
                    <div className="custom-option">
                      <span className="option-text">{category.name}</span>
                    </div>
                  </option>
                ))}
              </div>
            </select>
          </div>
        </div>
        <div>
          <label className="recipe-field-label">Description</label>
          <input
            id="description"
            className="recipe-field"
            placeholder="What makes this dish special?"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              addChangedField(e);
            }}
          />
        </div>
        <div>
          <label className="recipe-field-label">Chef's Tips</label>
          <textarea
            id="chefs_tip"
            rows="4"
            placeholder="Any tips or secrets to share?"
            className="recipe-field"
            value={chefs_tip}
            onChange={(e) => {
              setChefsTip(e.target.value);
              addChangedField(e);
            }}
          />
        </div>
        <div className="recipe-sliders">
          <div className="slider-container">
            <div className="slider-label">
              <span className="material-symbols-outlined">schedule</span>
              <span>{time}h</span>
            </div>
            <div className="flex-grow">
              <input
                className="w-full"
                max="8"
                min="0.5"
                step="0.5"
                type="range"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
          </div>
          <div className="slider-container">
            <div className="slider-label">
              <span className="material-symbols-outlined">group</span>
              <span>{servings}</span>
            </div>
            <div className="flex-grow">
              <input
                className="w-full"
                max="12"
                min="1"
                step="1"
                type="range"
                value={servings}
                onChange={(e) => {
                  setServings(e.target.value);
                  addChangedField(e);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="right-grid">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="recipe-field-label">Ingredients</label>
            <div className="flex gap-1.5">
              <input
                className="recipe-field"
                placeholder="Add ingredient..."
                type="text"
                value={ingredient}
                onChange={(e) => {
                  setIngredient(e.target.value);
                }}
              />
              <button
                className="bg-accent hover:bg-accent/90 text-info px-2 py-2 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg shadow-primary/10"
                type="button"
                onClick={() => addNewIngredient()}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <div className="flex flex-wrap py-2 gap-2">
              {ingredients.length === 0 && (
                <p className="text-center text-primary/50 py-12 border border-dashed border-primary/30 rounded-md w-full">
                  No ingredients added yet.
                </p>
              )}
              {ingredients.map((ing, index) => (
                <span
                  id={ing.name + "_ing"}
                  key={index}
                  className="inline-flex items-center gap-2 px-2 py-1 bg-info text-deep-navy rounded-full text-sm font-semibold cursor-default"
                >
                  {ing.name}
                  <span
                    className="material-symbols-outlined cursor-pointer hover:text-accent transition-colors"
                    onClick={() => {
                      removeIngredient(ing.name);
                    }}
                  >
                    close
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="recipe-field-label">Tags</label>
            <div className="flex gap-1.5">
              <input
                className="recipe-field"
                placeholder="Add tag..."
                type="text"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                }}
              />
              <button
                className="bg-accent hover:bg-accent/90 text-info px-2 py-2 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg shadow-primary/10"
                type="button"
                onClick={() => addNewTag()}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            <div className="flex flex-wrap py-2 gap-2">
              {tags.length === 0 && (
                <p className="text-center text-primary/50 py-12 border border-dashed border-primary/30 rounded-md w-full">
                  No tags added yet.
                </p>
              )}
              {tags.map((tag, index) => (
                <span
                  id={tag.name + "_tag"}
                  key={index}
                  className="inline-flex items-center gap-2 px-2 py-1 bg-info text-deep-navy rounded-full text-sm font-semibold cursor-default"
                >
                  {tag.name}
                  <span
                    className="material-symbols-outlined text-base cursor-pointer hover:text-accent transition-colors"
                    onClick={() => {
                      removeTag(tag.name);
                    }}
                  >
                    close
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-start justify-between">
            <label className="recipe-field-label">Steps</label>
            <button
              className="btn-add-step"
              type="button"
              onClick={openStepsModal}
            >
              <span className="material-symbols-outlined">add</span>
              {/* Add New Step */}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 mb-4">
            {steps.length === 0 && (
              <p className="text-center text-primary/50 py-24 border border-dashed border-primary/30 rounded-md w-full">
                No steps added yet.
              </p>
            )}
            {steps.map((step, index) => (
              <div className="flex items-center gap-8" key={index}>
                <div className="w-5 text-accent text-2xl font-display font-medium items-center justify-center px-2 pb-2">
                  {index + 1}
                </div>
                <div className="recipe-field">{step.title}</div>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={
                      index === 0 ? "text-primary/20" : "text-primary"
                    }
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                  >
                    <span className="material-symbols-outlined">stat_2</span>
                  </button>
                  <button
                    type="button"
                    className={
                      index === steps.length - 1
                        ? "text-primary/20"
                        : "text-primary"
                    }
                    onClick={() => moveStepDown(index)}
                    disabled={index === steps.length - 1}
                  >
                    <span className="material-symbols-outlined">
                      stat_minus_2
                    </span>
                  </button>
                  <div className="w-0.5 h-6 mb-1 mx-2 bg-primary/30"></div>
                  <button
                    type="button"
                    className="text-accent"
                    onClick={() => editStep(step, index)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    type="button"
                    className="text-red-500 ml-1"
                    onClick={() => removeStep(step)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            id="stepsModal"
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
          >
            <div className="modal-container">
              <div className="top-r-corner-buttons">
                <button
                  type="button"
                  onClick={closeStepsModal}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <header className="modal-header">
                <h2 id="modal-header"></h2>
                <div className="divider"></div>
              </header>
              <main className="modal-content">
                <div>
                  <label className="recipe-field-label">Title</label>
                  <input
                    type="text"
                    id="Confirm"
                    placeholder="What is the step title?"
                    className="recipe-field"
                    value={stepTitle}
                    onChange={(e) => {
                      setStepTitle(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label className="recipe-field-label">Instructions</label>
                  <textarea
                    id="Instructions"
                    rows="8"
                    placeholder="What should be done?"
                    className="recipe-field"
                    value={stepInstructions}
                    onChange={(e) => {
                      setStepInstructions(e.target.value);
                    }}
                  />
                </div>
              </main>
              <footer className="modal-footer">
                <button
                  id="save_step"
                  type="button"
                  className="btn"
                  onClick={() => saveStep()}
                >
                  Add Step
                </button>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col md:flex-row gap-2 items-center justify-center">
        <button
          className="w-full md:w-auto px-6 py-2 text-info text-lg font-bold rounded-xl transition-all bg-primary/15 hover:bg-primary/20"
          type="button"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className="w-full md:w-auto px-6 py-2 text-info text-lg font-bold rounded-xl transition-all bg-accent/80 hover:bg-accent"
          type="button"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default RecipeForm;
