// backend/middleware/auth.js
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// Optional role check if you add roles later
function requireRole(role) {
  return (req, res, next) => {
    const user = req.session?.user;
    if (user && (user.role === role || user.role === "superadmin")) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}

module.exports = { requireAuth, requireRole };
