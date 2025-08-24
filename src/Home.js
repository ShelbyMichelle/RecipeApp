import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import chefs from './chef1.jpg';
import service from './services.jpg';
import { UserContext } from './App';
import './Home.css';

const Home = () => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes from backend
  useEffect(() => {
    fetch('http://localhost:8000/recipes')
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              {user
                ? user.isNewUser
                  ? `Welcome, ${user.firstName}!`
                  : `Welcome back, ${user.firstName}!`
                : `Welcome!`}
            </h1>
            <h3>We Serve The Taste You Love</h3>
            <p>
              This is a type of restaurant which typically serves food and drinks, in addition to
              light refreshments such as baked goods or snacks. The term comes from the French word
              meaning food.
            </p>
            <Link to="/recipes" className="explore-btn" style={{ textDecoration: 'none' }}>
              Explore all Recipes
            </Link>
          </div>
          <div className="hero-image">
            <img src={chefs} alt="Chef with pizza" />
          </div>
        </div>
      </section>

      {/* Dynamic Recipes Section (Fetched from Backend) */}
      {recipes.length > 0 && (
        <section className="latest-recipes">
          <div className="container">
            <div className="section-header">
              <h2>YOUR RECIPES</h2>
              <p>Find your recent added recipes here</p>
            </div>
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-content">
                    <h3>{recipe.title}</h3>
                    <Link to="/recipe-list" className="recipe-btn">See Full Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      )}

      {/* Cuisine Types Section */}
    <section className="our-services">
      <div className="content-wrapper">
        <div className="services-image">
          <img src={service} alt="Chef!" />
        </div>

        {/* Main content */}
        <div className="services-content">
          <div className="section-header">
            <h2>OUR AWESOME SERVICES</h2>
          </div>

          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                  <line x1="6" y1="17" x2="18" y2="17" />
                  <line x1="6" y1="13" x2="18" y2="13" />
                </svg>
              </div>
              <div className="service-text">
                <h3>Professional Chef</h3>
                <p>Expert culinary professionals creating exceptional dishes with years of experience.</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h6l1 7H2l1-7Z" />
                  <path d="M16 6h5l1 7h-8l1-7Z" />
                  <path d="M6 2v4" />
                  <path d="M19 2v4" />
                  <circle cx="6" cy="10" r="1" />
                  <circle cx="19" cy="10" r="1" />
                </svg>
              </div>
              <div className="service-text">
                <h3>Quality Ingredients</h3>
                <p>Fresh, premium ingredients sourced from trusted suppliers for the best flavors.</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div className="service-text">
                <h3>Easy Recipes</h3>
                <p>Simple, step-by-step recipes that anyone can follow to create delicious meals.</p>
              </div>
            </div>

            <div className="service-item">
              <div className="service-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                  <path d="M7.5 8 10 12" />
                  <path d="m16.5 8-2.5 4" />
                  <path d="M12 2v4" />
                  <circle cx="12" cy="7" r="1" />
                </svg>
              </div>
              <div className="service-text">
                <h3>Quality Food</h3>
                <p>Premium dining experience with carefully crafted dishes and exceptional taste.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Home;
