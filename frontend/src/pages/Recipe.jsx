import { Link, useLocation, useNavigate } from "react-router-dom";

function Recipe() {
  const { state } = useLocation();
  const recipe = state.recipe;
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="container py-5">
        <div className="mb-2">
          <Link
            to="/recipe/edit"
            state={{ recipe: recipe }}
            className="btn btn-sm btn-default me-1"
          >
            Edit
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-danger me-1"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
          >
            Delete
          </button>
          <div
            className="modal fade"
            id="deleteModal"
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title" id="deleteModalLabel">
                    Confirm Deletion
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to delete this item? This action
                    cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <form id="my_form" method="post" action="DELETE">
                    CRSF TOKEN
                  </form>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="my_form"
                    className="btn btn-danger"
                    id="confirmDelete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="fw-bold mb-3">{recipe.title}</h1>
        <p className="text-muted">{recipe.description}</p>

        <div className="recipe-hero mb-4">
          {recipe.image ? (
            <img src={recipe.image} />
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

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="info-box">
              <strong>
                <i className="bi bi-cash-coin feature-icon"></i>
              </strong>
              <br />€{recipe.price}
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box">
              <strong>
                <i className="bi bi-clock feature-icon"></i>
              </strong>
              <br />
              {recipe.time_minutes} mins
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-box">
              <strong>
                <i className="bi bi-people feature-icon"></i>
              </strong>
              <br />
              {recipe.servings}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h4 className="mb-3 fw-bold">Ingredients</h4>
                {recipe.ingredients.map((ingredient) => (
                  <p className="list-ingredients" key={ingredient.id}>
                    {ingredient.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card ">
              <div className="card-body">
                <h4 className="mb-3 fw-bold">Instructions</h4>
                <div className="instructions">{recipe.instructions}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h4 className="mb-3 fw-bold">Tags</h4>
            {recipe.tags.map((tag, index, arr) => (
              <span className="mb-1 me-2" key={tag.id}>
                {tag.name}
                {index == arr.length - 1 ? <></> : <>,</>}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleClickBack}
          className="btn btn-sm btn-default mt-3"
        >
          Back
        </button>
      </div>
    </>
  );
}

export default Recipe;
