import { useNavigate } from "react-router-dom";

function RecipeList({ recipe }) {
  const navigate = useNavigate();
  const handleClickMethod = () => {
    navigate("/recipe", { state: { recipe: recipe } });
  };

  return (
    <div id={recipe.id} className="col-md-4">
      <div className="card recipe-card shadow-sm">
        <div className="card-img">
          {recipe.image ? (
            <img className="card-img-top" src={recipe.image} />
          ) : (
            <>
              <div className="no-img fw-bold d-flex justify-content-center">
                <span className="m-auto">
                  <i className="bi bi-image feature-icon"></i>
                </span>
              </div>
            </>
          )}
        </div>
        <div className="card-body">
          <div className="card-recipe-header">
            <h5 className="fw-bold">{recipe.title}</h5>
            <p className="text-muted">
              <em>{recipe.description}</em>
            </p>
          </div>
          <div className="card-recipe-info row text-center g-4">
            <div className="col-md-4">
              <i className="bi bi-clock me-1"></i>
              <p>{recipe.time_minutes} min</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-cash-coin me-1"></i>
              <p>€{recipe.price}</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-people"></i>
              <p>{recipe.servings}</p>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                handleClickMethod(recipe);
              }}
              className="btn btn-default mt-3"
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeList;
