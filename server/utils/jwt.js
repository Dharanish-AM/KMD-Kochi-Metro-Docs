const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign({ 
    id: user._id, 
    userId: user._id,
    email: user.email, 
    name: user.name,
    role: user.role,
    department: user.department
  }, SECRET_KEY, {
    expiresIn: "24h",
  });
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };