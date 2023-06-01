const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5500',
    credentials: true,
  })
);

// Configure passport
passport.use(
  new LocalStrategy((username, password, done) => {
    // Replace this with your actual authentication logic
    if (username === 'admin' && password === 'password') {
      return done(null, { username: 'admin' });
    } else {
      return done(null, false, { message: 'Incorrect username or password' });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  done(null, { username });
});

// Middleware setup

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    next();
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: 'http://localhost:5500/home.html',
    failureRedirect: 'http://localhost:5500/login.html',
  })
);

app.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ authenticated: true, username: req.user.username });
  } else {
    res.send({ authenticated: false });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:5500/login.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 