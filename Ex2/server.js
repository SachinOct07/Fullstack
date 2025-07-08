const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Set up view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public')); // for CSS or assets if needed

// GET: Render form
app.get('/', (req, res) => {
  res.render('form');
});

// POST: Handle form submission
app.post('/submit', (req, res) => {
  const formData = req.body;

  // Save data to data.json
  fs.writeFileSync('data.json', JSON.stringify(formData, null, 2));

  // Redirect to success page
  res.redirect('/success');
});

// GET: Render success page with submitted data
app.get('/success', (req, res) => {
  let data = {};
  try {
    const jsonData = fs.readFileSync('data.json');
    data = JSON.parse(jsonData);
  } catch (err) {
    console.error(err);
  }
  res.render('success', { data });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
