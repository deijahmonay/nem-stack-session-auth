// ============== IMPORTS =================
require('dotenv').config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session')


// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000"; // if env has a port, it will use that if not it'll use 3000
authController = require('./controllers/auth.js');

// ============== MONGO DATABASE =================

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// ============== Middleware =================

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true, //alows use to create empty session object, saves when session starts
  }))

// ============== Routes =================

app.get('/', async(req, res) => { //hompage
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use('/auth', authController) // everything that starts with /auth will live in auth.js


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
