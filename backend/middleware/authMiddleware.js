// Auth Middleware to protect routes

const protect = async (req, res, next) => {
  try {
    // TODO: Verify JWT token
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
