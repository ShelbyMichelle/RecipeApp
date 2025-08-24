import { useEffect, useState } from "react";
import fav from './fav1.jpg'
import favorite from './fav2.jpg'
import './Favorites.css'

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorite recipes on mount
  useEffect(() => {
    fetch("http://localhost:8000/recipes?favorite=true")
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((err) => console.error(err));
  }, []);

  // Remove recipe from favorites
  const handleRemoveFavorite = (id) => {
    fetch(`http://localhost:8000/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: false })
    })
      .then((res) => res.json())
      .then(() => {
        // Update state locally
        setFavorites(favorites.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="recipe-list">
        <img src={fav} alt="decoration" className="corner top-left" />
        <img src={favorite} alt="decoration" className="corner bottom-right" />
      <h2>Favorite Recipes</h2>
      {favorites.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        favorites.map((recipe) => (
          <div className="recipe-preview" key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p><strong>Time required:</strong> {recipe.time}</p>
            <p><strong>Steps:</strong></p>
            <p>{recipe.body}</p>
            
            <button onClick={() => handleRemoveFavorite(recipe.id)}>
              Remove from Favorites
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Favorites;
