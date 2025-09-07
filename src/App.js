import './index.css';
import Navbar from './Navbar';
import Home from './Home';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import Create from './Create';
import ShoppingList from './ShoppingList';
import Favorites from './Favorites';
import RecipeDetails from './RecipeDetails';
import NotFound from './NotFound';
import SignupPage from './SignupPage';
import Login from './Login';
import Landing from './Landing';
import RecipeSearch from './recipeSearch';
import { db, auth } from './firebase';
import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext } from 'react';
import RecipeList from './RecipeList';

export const UserContext = createContext();

const AppContent = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();
  const [, setRecipeList] = useState([]);

  // Add ingredients to shopping list
  const addToShoppingList = (ingredients) => {
    setShoppingList(prev => {
      // Merge duplicates
      const newList = [...prev];
      ingredients.forEach(item => {
        if (!newList.includes(item)) {
          newList.push(item);
        }
      });
      return newList;
    });
  };

  // Remove one ingredient
  const removeFromShoppingList = (itemToRemove) => {
    setShoppingList(prev => prev.filter(item => item !== itemToRemove));
  };

  // Clear all ingredients
  const clearShoppingList = () => setShoppingList([]);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const displayName = firebaseUser.displayName;
        const firstName = displayName ? displayName.split(' ')[0] : 'User';
        
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: firstName,
          lastName: displayName ? displayName.split(' ').slice(1).join(' ') : '',
          displayName: displayName
        });
      } else {
        // User is signed out
        setUser(null);
      }
      setAuthLoading(false); // Auth check is complete
    });

    const getRecipeList = async () => {
      try {
        const recipeCollectionRef = collection(db, "recipes");
        const data = await getDocs(recipeCollectionRef);
        const recipes = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecipeList(recipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    getRecipeList();
    return () => unsubscribe();
  }, []);

  const hideNavbarRoutes = ['/', '/signup', '/login'];

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="App">
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route path="/search">
              <RecipeSearch />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            {/* IMPORTANT: Put the more specific route (/recipes/:id) BEFORE the general route (/recipes) */}
            <Route path="/recipes/:id">
              <RecipeDetails />
            </Route>
            <Route path="/recipes">
              <RecipeSearch />
            </Route>
            <Route path="/create">
              <Create />
            </Route>
            <Route path="/shopping">
              <ShoppingList 
                list={shoppingList} 
                removeItem={removeFromShoppingList} 
                clearList={clearShoppingList} 
              />
            </Route>
            <Route path="/favorite">
              <Favorites />
            </Route>
            <Route path="/recipe-list">
              <RecipeList addToShoppingList={addToShoppingList} />
            </Route>
            <Route path="/signup">
              <SignupPage />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </UserContext.Provider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;