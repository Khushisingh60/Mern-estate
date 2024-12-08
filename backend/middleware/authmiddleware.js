import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authmiddleware = async (req, res, next) => {
  try {
    // Access the Authorization header using req.headers['authorization'] for consistency
    console.log(req.headers)
    const authHeader = req.headers['authorization']; // Use lowercase for consistency
    console.log("Authorization Header:", authHeader); // Debugging line to check the header

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Authorization header is missing" });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1]; // Splitting "Bearer <token>"
    if (!token) {
      return res.status(401).json({ success: false, message: "Token is missing" });
    }

    // Verify the token
    const decoded = jwt.verify(token, "secretkeyofnoteapp123@#");

    // Fetch the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Attach user information to the request object
    req.user = { name: user.name, id: user._id };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res.status(500).json({ success: false, message: "Authentication failed. Please login again." });
  }
};

export default authmiddleware;
