import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Log Authorization header for debugging
  console.log(req.headers);
  console.log('Authorization Header:', req.headers['authorization']);

  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(errorHandler(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

  // Verify the token
  jwt.verify(token, 'secretkeyofrealestateapp123@#', (err, user) => {
    if (err) {
      console.error('Token verification error:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    console.log('Decoded user from token:', req.user);

    next();
  });
  
};
