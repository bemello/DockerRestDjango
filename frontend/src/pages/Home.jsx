import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TagCloud } from "react-tagcloud";
import RecipeList from "../components/RecipeList";
import api from "../utils/api";

function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTags();
    getFeaturedRecipes();
  }, []);

  const getTags = () => {
    api
      .get("/api/recipe/tags", { params: { assigned_only: 1 } })
      .then((res) => res.data)
      .then((data) => handleTags(data))
      .catch((err) => alert(err));
  };

  function handleTags(data) {
    let temp_tags = [];
    data.forEach((element) => {
      temp_tags.push({
        id: element.id,
        value: element.name,
        count: element.tag_recipes.length,
      });
    });
    setTags(temp_tags);
  }

  const colors = {
    luminosity: "dark",
    hue: "orange",
  };

  const tagsCloud = () => (
    <TagCloud
      minSize={18}
      maxSize={35}
      tags={tags}
      colorOptions={colors}
      className="simple-cloud"
      onClick={(tag) =>
        navigate("/recipes", {
          state: { tag: { id: `${tag.id}`, name: `${tag.value}` } },
        })
      }
    />
  );

  const getFeaturedRecipes = () => {
    api
      .get("/api/recipe/recipes", { params: { featured: "True" } })
      .then((res) => res.data)
      .then((data) => setFeaturedRecipes(data))
      .catch((err) => alert(err));
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-text">
            <h1 className="fw-bold display-5">
              A Personal Catalogue
              <br />
              For All Your Recipes
            </h1>
            <p className="lead mt-3">
              Find that special recipe of yours with no hassle.
            </p>
            <Link to="/recipes" className="btn btn-default mt-3">
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <i className="bi bi-clock feature-icon"></i>
            <h5 className="mt-3">Quick & Easy</h5>
            <p>All your recipes in one place</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-tags feature-icon"></i>
            <h5 className="mt-3">Tags</h5>
            <p>Define custom tags to categorize your recipes</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-list-task feature-icon"></i>
            <h5 className="mt-3">Filter</h5>
            <p>Search recipes by tags or ingredients</p>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">
          —— <span className="fw-bold me-3 ms-3">Featured Recipes</span> ——
        </h2>
        <div className="row g-4">
          {featuredRecipes.map((recipe) => (
            <RecipeList recipe={recipe} key={recipe.id} />
          ))}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="text-center mb-4">
          —— <span className="fw-bold me-3 ms-3">Tag Cloud</span> ——
        </h2>
        <div className="text-center">{tagsCloud()}</div>
      </section>
    </>
  );
}

export default Home;
