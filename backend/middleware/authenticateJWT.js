import jwt from 'jsonwebtoken';

// Use the same secret as in your auth routes
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey123';

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

  // Check if the format is "Bearer TOKEN"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Authentication format is Bearer TOKEN' });
  }

  const token = parts[1];
  
  try {
    console.log('Attempting to verify with secret:', JWT_SECRET.substring(0, 3) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(400).json({ error: 'Invalid token: ' + err.message });
  }
};

export default authenticate;