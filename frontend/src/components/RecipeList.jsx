import { Link, useNavigate } from "react-router-dom";

function RecipeList({ recipe }) {
  const navigate = useNavigate();

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <div id={recipe.id} className="recipe-card group">
        <div className="image-container">
          {recipe.image ? (
            <div
              className="recipe-img"
              style={{
                backgroundImage: `url(${recipe.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          ) : (
            <div className="no-recipe-img">
              <span className="material-symbols-outlined text-5xl">
                chef_hat
              </span>
            </div>
          )}
        </div>
        <div className="recipe-card-body">
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </div>
        <div className="recipe-card-footer">
          <div className="recipe-metadata">
            <div interestfor="popover-time" popoverTarget="popover-time">
              <span className="material-icons-outlined scale-75">
                schedule
              </span>
              <span>{recipe.time_minutes}m</span>
              <div id="popover-time" className="popover" popover="auto">
                How much time does this recipe take to make?
              </div>
            </div>
            <div
              interestfor="popover-servings"
              popoverTarget="popover-servings"
            >
              <span className="material-icons-outlined scale-75">group</span>
              <span>{recipe.servings}</span>
              <div id="popover-servings" className="popover" popover="auto">
                How many people does this recipe serve?
              </div>
            </div>
            <div
              interestfor="popover-ingredients"
              popoverTarget="popover-ingredients"
            >
              <span className="material-icons-outlined scale-75">
                shopping_basket
              </span>
              <span>{recipe.ingredients.length}</span>
              <div id="popover-ingredients" className="popover" popover="auto">
                How many ingredients does this recipe have?
              </div>
            </div>
          </div>
          <div className="btn-container">
            {/* <Link
            to={`/recipe/${recipe.id}`}
            className="button-outline recipe-button"
          >
            <div>
              <span>View Recipe</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </Link> */}
            <button className="button-outline recipe-button">
              <div>
                <span>View Recipe</span>
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RecipeList;
