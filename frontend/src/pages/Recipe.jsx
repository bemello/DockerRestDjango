import { Link, useNavigate, useLoaderData } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api";

function Recipe() {
  const navigate = useNavigate();
  const recipe = useLoaderData();

  const handleClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <section className="recipe-container">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary dark:text-white leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xl text-secondary font-display italic leading-relaxed">
              {recipe.description}
            </p>
          </div>
          <div className="grid grid-cols-3 md:flex gap-2">
            <div className="flex flex-col items-center justify-center px-4 py-4 rounded-[0.75rem] border border-primary/10 min-w-[8rem]">
              <span className="material-symbols-outlined text-accent mb-2 text-3xl">
                menu_book_2
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-bold">
                Category
              </span>
              <span className="text-lg font-display font-bold text-primary">
                {recipe.category}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-4 rounded-[0.75rem] border border-primary/10 min-w-[8rem]">
              <span className="material-symbols-outlined text-accent mb-2 text-3xl">
                schedule
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-bold">
                Time
              </span>
              <span className="text-lg font-display font-bold text-primary">
                {recipe.time_minutes} min
              </span>
            </div>
            <div className="flex flex-col items-center justify-center px-4 py-4 rounded-[0.75rem] border border-primary/10 min-w-[8rem]">
              <span className="material-symbols-outlined text-accent mb-2 text-3xl">
                restaurant_menu
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-bold">
                Serves
              </span>
              <span className="text-lg font-display font-bold text-primary">
                {recipe.servings} {recipe.servings === 1 ? "Person" : "People"}
              </span>
            </div>
          </div>
        </div>
        <div
          className={
            recipe.image
              ? "relative w-full aspect-[21/9] rounded-[0.75rem] overflow-hidden mb-12 bg-center bg-cover"
              : "hidden"
          }
          style={
            recipe.image ? { backgroundImage: `url(${recipe.image})` } : {}
          }
        ></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <section className="p-8 md:p-10 rounded-[0.75rem] shadow-sm bg-base-background border border-info/50">
              <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <span className="w-6 h-1 bg-accent rounded-full"></span>
                Ingredients
              </h2>
              <ul className="space-y-6">
                {recipe.ingredients.sort().map((ingredient) => (
                  <li
                    className="flex items-start gap-4 group"
                    key={ingredient.id}
                  >
                    <span className="mt-1 w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] opacity-0">
                        check
                      </span>
                    </span>
                    <span className="text-info/75 font-medium">
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="p-8">
              <h2 className="text-lg font-display font-bold mb-4 text-primary">
                Chef's Tips
              </h2>
              <p className="text-secondary text-md leading-relaxed italic">
                {recipe.chefs_tip && recipe.chefs_tip !== ""
                  ? `"${recipe.chefs_tip}"`
                  : "No chef's tips provided yet."}
              </p>
            </section>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <section className="p-8 md:p-12 rounded-[0.75rem] shadow-sm bg-base-background border border-info/50">
              <h2 className="text-3xl font-display font-bold mb-10 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full"></span>
                Instructions
              </h2>
              <div className="space-y-12">
                {recipe.steps.length > 0 ? (
                  recipe.steps.map((step, index) => (
                    <div className="flex gap-8" key={step.id}>
                      <span
                        className={
                          "flex-shrink-0 w-12 h-12 pb-1 rounded-2xl flex items-center justify-center font-display font-bold text-xl border " +
                          (index % 2 === 0
                            ? "border-accent/50 bg-accent/50 text-accent"
                            : "border-secondary/50 bg-secondary/50 text-secondary")
                        }
                      >
                        {step.step_number}
                      </span>
                      <div>
                        <h3 className="text-xl font-display font-bold mb-3 text-primary">
                          {step.title}
                        </h3>
                        <p className="text-info/65 leading-relaxed text-lg">
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No steps found</p>
                )}
              </div>
            </section>
            <section className="flex flex-wrap gap-3">
              {recipe.tags.sort().map((tag, index, arr) => (
                <span
                  key={tag.id}
                  className="px-5 py-2.5 bg-primary/10 border border-accent/50 text-accent rounded-full text-sm font-medium transition-colors cursor-default shadow-sm"
                >
                  {tag.name}
                </span>
              ))}
            </section>
          </div>
        </div>
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleClickBack}
            className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-lg">Back</span>
          </button>
        </div>
      </section>
    </>
  );
}

export default Recipe;
