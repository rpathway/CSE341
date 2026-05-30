import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';


const userController = {};


userController.register = async (req, res) => {
  try {
    if (req.session.user) {
      return res.status(400).json({
        error: 'Already logged in'
      });
    }

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'username, email and password are required'
      });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({
        error: 'Email already in use'
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    await userModel.create({
      githubId: null,
      username,
      email,
      password: hashed
    });

    res.status(201).json({ message: 'User created successfully'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

userController.login = async (req, res) => {
  try {
    if (req.session.user) {
      return res.status(400).json({
        error: 'Already logged in'
      });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials'});
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.user = user;
    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};


export default userController;