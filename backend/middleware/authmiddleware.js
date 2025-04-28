// import jwt from 'jsonwebtoken';
// import User from '../models/user.model.js';

// const authmiddleware = async (req, res, next) => {
//   try {
//     // Access the Authorization header using req.headers['authorization'] for consistency
//     console.log(req.headers)
//     const authHeader = req.headers['authorization']; // Use lowercase for consistency
//     console.log("Authorization Header:", authHeader); // Debugging line to check the header

//     if (!authHeader) {
//       return res.status(401).json({ success: false, message: "Authorization header is missing" });
//     }

//     // Extract the token from the Authorization header
//     const token = authHeader.split(' ')[1]; // Splitting "Bearer <token>"
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Token is missing" });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, "secretkeyofnoteapp123@#");

//     // Fetch the user associated with the token
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     // Attach user information to the request object
//     req.user = { name: user.name, id: user._id };
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error("Error in authentication middleware:", error.message);
//     return res.status(500).json({ success: false, message: "Authentication failed. Please login again." });
//   }
// };

// export default authmiddleware;
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authmiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware - Request headers:', JSON.stringify(req.headers));
    
    // Check for authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Authorization header found:', authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ success: false, message: "Authorization header is missing" });
    }
    
    // Extract the token
    const parts = authHeader.split(' ');
    console.log('Auth header parts:', parts);
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid Authorization format, expected: Bearer <token>');
      return res.status(401).json({ success: false, message: "Invalid Authorization format" });
    }
    
    const token = parts[1];
    console.log('Token extracted:', token.substring(0, 10) + '...');
    
    // Verify token with secret
    const decoded = jwt.verify(token, "secretkeyofnoteapp123@#");
    console.log('Token verified, decoded:', decoded);
    
    // Fetch the user
    const user = await User.findById(decoded.id);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    // Set user data on request
    req.user = { 
      name: user.username || user.name, 
      id: user._id 
    };
    console.log('User attached to request:', req.user);
    
    // Continue to the route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Authentication failed. Please login again.",
      error: error.message
    });
  }
};

export default authmiddleware;
