const verifyAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

module.exports = verifyAdmin;