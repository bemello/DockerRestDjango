import { useLocation } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";

function UpdateRecipe() {
  const { state } = useLocation();
  const recipe = state.recipe;

  return <RecipeForm recipe={recipe} />;
}

export default UpdateRecipe;
