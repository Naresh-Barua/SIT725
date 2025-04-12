const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');


// Passport configuration
require('./config/passport');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Session middleware needed for Passport (Google OAuth)
app.use(session({
  secret: 'YOUR_SESSION_SECRET',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/CTB',)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
// app.use('/api/tasks/:taskId/comments', commentsRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'landing.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App listening at: http://localhost:" + port);
});

module.exports = app; // Export for testing

