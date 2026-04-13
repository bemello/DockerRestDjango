import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";

import api from "../utils/api";

function RecipesByCategory() {
  const [recipesByCategory, setRecipesByCategory] = useState([]);

  useEffect(() => {
    const fetchRecipesByCategory = async () => {
      try {
        const response = await api.get(
          "api/recipe/recipes/recipes-by-category/",
        );
        setRecipesByCategory(response.data);
      } catch (error) {
        console.error("Error fetching recipes by category:", error);
      }
    };
    fetchRecipesByCategory();
  }, []);

  return (
    <Doughnut
      data={{
        labels: recipesByCategory.map((recipe) => recipe.category),
        datasets: [
          {
            label: "Total",
            data: recipesByCategory.map((recipe) => recipe.count),
            backgroundColor: [
              "oklch(0.7442 0.1431 32.3)",
              "oklch(0.6739 0.0437 200.02)",
              "oklch(0.51 0.03 255.27)",
              "oklch(0.9085 0.0361 53.7)",
              "oklch(0.6442 0.1431 32.3)",
              "oklch(0.61 0.03 255.27)",
            ],
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 0,
        plugins: {
          tooltip: {
            titleColor: "oklch(0.3766 0.0159 255.61)",
            bodyColor: "oklch(0.3766 0.0159 255.61)",
            backgroundColor: "oklch(0.9085 0.0361 53.7)",
          },
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: "oklch(0.9085 0.0361 53.7)",
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
      }}
    />
  );
}

export default RecipesByCategory;
