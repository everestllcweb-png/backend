// backend/routes/auth.js
const express = require("express");
const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

/** POST /api/auth/login */
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = { username, role: "admin" }; // store whatever you need
    return res.json({ message: "Logged in", user: req.session.user });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

/** POST /api/auth/logout */
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

/** GET /api/auth/me (used by frontend guard) */
router.get("/me", (req, res) => {
  if (req.session && req.session.user) return res.json(req.session.user);
  return res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
