import './ShoppingList.css'
import shopping from './shopping2.jpg'
import shop from './shopping.jpg'

const ShoppingList = ({ list = [], removeItem, clearList }) => {
  return (
    <div className="shopping">
    <img src={shopping} alt="decoration" className="corner top-left" />
    <img src={shop} alt="decoration" className="corner top-right" />
      <h2>My Shopping List</h2>
      {list.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        <ul>
          {list.map((item, idx) => (
            <li key={idx}>
              {item} <button onClick={() => removeItem(item)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && <button onClick={clearList}>Clear All</button>}
    </div>
  );
};

export default ShoppingList;
