require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Student = require('./models/Student');
const path = require('path');
console.log("Loaded MONGO_URL:", process.env.MONGODB_URI); 
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

app.post('/add', async (req, res) => {
    const { name, email, course } = req.body;
    await Student.create({ name, email, course });
    res.redirect('/');
});

app.post('/update/:id', async (req, res) => {
    const { name, email, course } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, email, course });
    res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
