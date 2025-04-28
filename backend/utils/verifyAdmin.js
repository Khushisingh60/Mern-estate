import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    const decoded = jwt.verify(token, 'secretkeyofrealestateapp123@#');
    if (decoded.role !== 'admin') return res.status(403).json({ message: "Access denied. Admins only." });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
