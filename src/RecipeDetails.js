import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeDetails } from './spoonacularService';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getRecipeDetails(id);
        setRecipe(data);
      } catch (err) {
        console.error('Failed to fetch recipe details', err);
        setError('Failed to load recipe details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading recipe...</h2>
        <p>Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#f1356d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ⬅ Back to Recipes
          </button>
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Recipe not found</h2>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <button 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#f1356d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ⬅ Back to Recipes
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1>{recipe.title}</h1>
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        style={{ width: '100%', borderRadius: '12px', marginBottom: '20px' }} 
      />
      
      {recipe.summary && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Summary</h3>
          <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> {recipe.servings}</p>
      </div>

      <Link to="/home" style={{ textDecoration: 'none' }}>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#f1356d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Recipes
        </button>
      </Link>
    </div>
  );
};

export default RecipeDetails;