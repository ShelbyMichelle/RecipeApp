import { useEffect, useState } from "react";
import './RecipeList.css';
import top from './chef.jpg';
import bottom from './bottom.jpg';

const RecipeList = ({ title, addToShoppingList }) => { // <- receive as prop
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/recipes") // fetch recipes from JSON server / API
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error(err));
  }, []);

  // Delete a recipe
  const handleDelete = (id) => {
    fetch(`http://localhost:8000/recipes/${id}`, { method: "DELETE" })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Toggle favorite
  const handleFavorite = (id, currentFavorite) => {
    fetch(`http://localhost:8000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !currentFavorite })
    })
      .then((res) => res.json())
      .then((updatedRecipe) => {
        setRecipes(
          recipes.map((recipe) =>
            recipe.id === id ? updatedRecipe : recipe
          )
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="recipe-list">
      <img src={top} alt="decoration" className="corner top-left" />
      <img src={bottom} alt="decoration" className="corner bottom-right" />
      <h2>{title}</h2>

      {recipes.map((recipe) => (
        <div className="recipe-preview" key={recipe.id}>
          <h2>{recipe.title}</h2>
          <p><strong>Time required:</strong> {recipe.time}</p>
          <p><strong>Steps:</strong></p>
          <p className="recipe-steps">{recipe.body}</p>

          {/* Ingredients List */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <>
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <button onClick={() => addToShoppingList(recipe.ingredients)}>
                Add Ingredients to Shopping List
              </button>
            </>
          )}

          <button
            onClick={() => handleFavorite(recipe.id, recipe.favorite)}
            disabled={recipe.favorite} // disables the button if already favorite
          >
            {recipe.favorite ? "★ Favorite" : "☆ Mark as Favorite"}
          </button>

          <button onClick={() => handleDelete(recipe.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;
