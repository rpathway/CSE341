/**
 * server.js - Entry point
 *
 *
 * Responsibilities:
 *   - Bootstrap Express with middleware
 *   - Mount all route modules
 *
 * Everything else lives in routes/.
 */
import 'dotenv/config';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';

import { Strategy } from 'passport-github2';
import { fileURLToPath } from 'url';
import mongoDatabase from './config/db.js';
import userModel from './models/userModel.js';

import authRoute from './routes/auth.js';
import expenseRoute from './routes/expenseRoute.js';
import budgetRoute from './routes/budgetRoute.js';
import swaggerRoute from './routes/swaggerRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);


////////////////////////////////////////
// Middleware
////////////////////////////////////////
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    const user = await userModel.findByGithubId(profile.id);
    if (!user)   await userModel.create({
      githubId: profile.id,
      username: profile.username,
      email: profile.emails?.[0]?.value || null,
      password: null
    });

    return done(null, user);
  }
));
passport.serializeUser((user, done) => {
  done(null, user?._id.toString());
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
})

////////////////////////////////////////
// Routes
////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRoute);
app.use('/api-docs', swaggerRoute);
app.use('/expenses', expenseRoute);
app.use('/budgets', budgetRoute);
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


////////////////////////////////////////
// Server
////////////////////////////////////////
mongoDatabase.connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error(`Could not connect to database: ${err}`);
});


process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});

