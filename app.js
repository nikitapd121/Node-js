const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Route imports
const hostRoutes = require('./routes/hostr');
const userRoutes = require('./routes/userr');
const authRoutes = require('./routes/authr');

const app = express();

// MongoDB URI and session store
const MONGO_URI = "mongodb+srv://root:root@cluster0.vn6mtdc.mongodb.net/airbnb?retryWrites=true&w=majority&tls=true";

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Session middleware (now using store)
app.use(session({
  secret: 'yourSecretKey',  // Replace with a strong secret in production
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set login info to locals for EJS access
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn === true;
  res.locals.isLoggedIn = req.isLoggedIn;
  next();
});

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) return next();
  res.redirect('/login');
}

// Routes
app.use('/', userRoutes); // public pages
app.use('/host', isAuthenticated, hostRoutes); // protected host routes
app.use('/', authRoutes); // login/signup/logout

// 404
app.use((req, res) => {
  res.status(404).send('<b>Page not found.</b>');
});

// MongoDB connection and server start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(3080, () => {
      console.log("🚀 Server running at: http://localhost:3080");
    });
  })
  .catch(err => {
    console.error("❌ Error connecting to MongoDB:", err);
  });
