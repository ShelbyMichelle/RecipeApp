import { Link } from 'react-router-dom';
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-content">
        <h3>MyRecipeBook</h3>
        <p>Discover, save, and share your favorite recipes!</p>
        <Link to="/signup">
          <button>Get started</button>
        </Link>
      </div>
    </div>
  );
}
export default Landing;