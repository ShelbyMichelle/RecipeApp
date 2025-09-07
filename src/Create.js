import { useState } from "react";
import { useHistory } from 'react-router-dom';
import './Create.css';
import { db } from './firebase';  // import the Firestore instance
import { collection, addDoc } from "firebase/firestore";


const Create = () => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [body, setBody] = useState('');
  const [isPending, setIsPending] = useState(false);
  const history = useHistory();

const handleSubmit = async (e) => {
  e.preventDefault();
  const recipe = { title, time, body};

  setIsPending(true);

  try {
    // 1. Add to JSON server
    await fetch('http://localhost:8000/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });

    // 2. Add to Firebase Firestore
    await addDoc(collection(db, "recipes"), recipe);

    console.log('Recipe added to both JSON server and Firebase');
    setIsPending(false);
    history.push('/home'); // redirect to home page
  } catch (err) {
    console.error('Error adding recipe:', err);
    setIsPending(false);
  }
};

  return (
    <div className="create-container">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Add a New Recipe</h2>
          <p className="form-subtitle">Share your culinary creation with the world</p>
        </div>
        
        <form className="recipe-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RECIPE TITLE</label>
            <input
              type="text"
              className="form-input"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your recipe title..."
            />
          </div>

          <div className="form-group">
            <label>Time Required</label>
            <input
              type="text"
              className="form-input"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g., 30 minutes"
            />
          </div>

          <div className="form-group">
            <label>Steps to Follow</label>
            <textarea
              className="form-textarea"
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe the cooking steps in detail..."
            />
          </div>

          {!isPending && (
            <button type="submit" className="form-button">
              Add Recipe
            </button>
          )}
          {isPending && (
            <button disabled className="form-button">
              <div className="button-loading">
                <div className="spinner"></div>
                Adding Recipe...
              </div>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Create;