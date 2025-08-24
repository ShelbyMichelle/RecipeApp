import React, { useState, useEffect } from 'react';
import { getRandomRecipes, searchRecipes } from './spoonacularService';

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load random recipes when component mounts
  useEffect(() => {
    loadRandomRecipes();
  }, []);

  const loadRandomRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRandomRecipes(20); // Get 20 random recipes
      setRecipes(data.recipes);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadRandomRecipes(); // If empty search, load random recipes
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const data = await searchRecipes(searchQuery, 20);
      setRecipes(data.results);
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadRandomRecipes();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading delicious recipes...</h2>
        <div> Please wait...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Explore All Recipes</h1>
        <p>Discover thousands of delicious recipes from around the world</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for recipes (e.g., pasta, chicken, vegan)..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit" 
            disabled={isSearching}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f1356d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              style={{
                padding: '12px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Results Info */}
      <div style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
        {searchQuery ? (
          <p>Showing results for "{searchQuery}" ({recipes.length} recipes found)</p>
        ) : (
          <p>Discover one recipe at a time</p>
        )}
      </div>

      {/* Recipes Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '25px',
        marginTop: '20px'
      }}>
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            style={{ 
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'cover' 
              }} 
            />
            <div style={{ padding: '16px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                color: '#333'
              }}>
                {recipe.title}
              </h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '12px', fontSize: '14px', color: '#666' }}>
                {recipe.readyInMinutes && (
                  <span>⏱️ {recipe.readyInMinutes} min</span>
                )}
                {recipe.servings && (
                  <span>👥 {recipe.servings} servings</span>
                )}
              </div>

              {recipe.dishTypes && recipe.dishTypes.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  {recipe.dishTypes.slice(0, 2).map((type, index) => (
                    <span 
                      key={index}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#e9ecef',
                        color: '#495057',
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        marginRight: '6px',
                        textTransform: 'capitalize'
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              <button 
                onClick={() => window.open(recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`, '_blank')}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {recipes.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>No recipes found</h3>
          <p>Try searching with different keywords or browse our random selection.</p>
          <button 
            onClick={loadRandomRecipes}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            Show Random Recipes
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;