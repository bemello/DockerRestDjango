import RecipeForm from "../components/RecipeForm";

function CreateRecipe() {
  return (
    <section className="recipe-form-container">
      {/* <div class="max-w-4xl mx-auto"> */}
      <header className="recipe-form-header">
        <h2>Create a New Recipe</h2>
        <div className="divider"></div>
        <p className="recipe-form-description">
          Create your culinary masterpiece. Add ingredients, instructions, and
          more to save your recipe into your collection.
        </p>
      </header>

      <RecipeForm recipe={null} />
      {/* </div> */}
    </section>
  );
}

export default CreateRecipe;
