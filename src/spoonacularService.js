const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

// Search for recipes
export const searchRecipes = async (query, number = 12) => {
  if (!API_KEY) {
    throw new Error(
      "Spoonacular API key is not configured. Add REACT_APP_SPOONACULAR_API_KEY to your .env file."
    );
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/complexSearch?query=${encodeURIComponent(query)}&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recipes: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Search recipes error:", error);
    throw error;
  }
};

// Get recipe details
export const getRecipeDetails = async (recipeId) => {
  if (!API_KEY) {
    throw new Error("Spoonacular API key is not configured.");
  }

  try {
    const response = await fetch(`${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recipe details: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get recipe details error:", error);
    throw error;
  }
};

// Get random recipes
export const getRandomRecipes = async (number = 10) => {
  if (!API_KEY) {
    throw new Error("Spoonacular API key is not configured.");
  }

  try {
    const url = `${BASE_URL}/recipes/random?number=${number}&apiKey=${API_KEY}`;
    console.log("Fetching random recipes from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch random recipes: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Random recipes fetched successfully:", data.recipes?.length || 0, "recipes");
    return data;
  } catch (error) {
    console.error("Get random recipes error:", error);
    throw error;
  }
};

// Get popular recipes
export const getPopularRecipes = async (number = 12) => {
  if (!API_KEY) {
    throw new Error("Spoonacular API key is not configured.");
  }

  try {
    const response = await fetch(
      `${BASE_URL}/recipes/complexSearch?sort=popularity&number=${number}&addRecipeInformation=true&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch popular recipes: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get popular recipes error:", error);
    throw error;
  }
};
