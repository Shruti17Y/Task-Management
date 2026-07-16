const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// Seed user database in-memory
const users = [];

// Initialize default admin user
const initializeDefaultUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  users.push({
    id: 'seed-admin-id',
    name: 'Admin User',
    email: 'admin@example.com',
    password: hashedPassword,
  });
};
initializeDefaultUser();

// Authentication Controller

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email, and password');
    }

    const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    };
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    next(error);
  }
};
