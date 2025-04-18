// server.js
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const session    = require('express-session');
const passport   = require('passport');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');

// Initialize
const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

// Make io available in controllers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'YOUR_SESSION_SECRET',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Static
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB
mongoose.connect('mongodb://localhost:27017/CTB', {
})
.then(() => console.log('MongoDB connected!'))
.catch(console.error);

// -----------------------------
// ROUTES
// -----------------------------

// 1) AUTH (register, login, Google OAuth, forgot/reset all in one)
const authRouter = express.Router();
const authController = require('./controllers/authController');

// Register & Login
authRouter.post('/register', authController.register);
authRouter.post('/login',    authController.login);

// Google OAuth
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  authController.googleCallback
);

// Forgot / Reset
authRouter.post('/forgot',            authController.forgotPassword);
authRouter.post('/reset/:token',      authController.resetPassword);
authRouter.get ('/reset/:token',      (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'reset-password.html'));
});

// Mount all auth routes
app.use('/api/auth', authRouter);

// 2) TASKS
const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

// 3) COMMENTS (nested under tasks)
const commentsRouter = require('./routes/comments');
app.use('/api/tasks/:taskId/comments', commentsRouter);

// 4) WORKERS
const workersRouter = require('./routes/workers');
app.use('/api/workers', workersRouter);

// 5) ALL OTHER REQUESTS → Landing Page
// no path means "all methods, all routes" — no path‑to‑regexp required
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'landing.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
// Export for tests
module.exports = app;
