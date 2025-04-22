import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('Authorization header:', token);

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    console.log('Decoded token:', decoded);  // Verify decoded content
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

export default authenticate;
