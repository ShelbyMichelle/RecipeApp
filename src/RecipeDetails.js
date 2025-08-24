// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const RecipeDetails = () => {
//   const { id } = useParams(); 
//   const [recipe, setRecipe] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:8000/recipes/${id}`)
//       .then(res => res.json())
//       .then(data => setRecipe(data))
//       .catch(err => console.error(err));
//   }, [id]);

//   if (!recipe) return <div>Loading...</div>;

//   return (
//     <div className="recipe-details">
//       <h1>{recipe.title}</h1>
//       <p><strong>Time Required:</strong> {recipe.time}</p>
//       <h3>Ingredients</h3>
//       <ul>
//         {recipe.ingredients.map((ing, index) => (
//           <li key={index}>{ing}</li>
//         ))}
//       </ul>
//       <h3>Process</h3>
//       <p>{recipe.process}</p>
//     </div>
//   );
// };

// export default RecipeDetails;
