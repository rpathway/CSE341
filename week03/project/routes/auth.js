import bcrypt from 'bcrypt';
import express from 'express';
import passport from 'passport';
import userController from '../controllers/userController.js';

const router = express.Router();


router.get('/', (req, res) => {
  const user = req.session.user;
  res.send(user ? `Logged in as ${user.username}` : 'Logged Out');
});
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/login/github',
  passport.authenticate('github'),
  (req, res) => {}
);
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy();
    res.redirect('/');
  });
});
router.get('/github/callback',
  passport.authenticate('github',{
    failureRedirect: '/api-docs',
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);



export default router;