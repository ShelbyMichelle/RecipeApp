const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Route to fetch all recipes
app.get('/recipes', (req, res) => {
  db.query('SELECT * FROM recipes', (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
