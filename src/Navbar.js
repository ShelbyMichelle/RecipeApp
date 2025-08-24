import {Link} from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="links">
        <Link to="/home">My Recipes</Link>
        <Link to="/shopping">Shopping list</Link>
        <Link to="/favorite">Favorites</Link>
        <Link to="/create">Add Recipe</Link>
      </div>
    </nav>
  );
};

export default Navbar;
