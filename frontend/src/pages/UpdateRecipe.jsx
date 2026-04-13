import { useLoaderData } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";

function UpdateRecipe() {
  const recipe = useLoaderData();

  return (
    <section className="recipe-form-container">
      {/* <div class="max-w-4xl mx-auto"> */}
      <header className="recipe-form-header">
        <h2>Update this Recipe</h2>
        <div className="divider"></div>
        <p className="recipe-form-description">
          Refine your culinary creation. Update ingredients, instructions, and
          more to keep your collection fresh and inspiring.
        </p>
      </header>

      <RecipeForm recipe={recipe} />
      {/* </div> */}
    </section>
  );
}

export default UpdateRecipe;
