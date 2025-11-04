// cloudinary.js
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

function required(v, name) {
  if (!v) throw new Error(`Missing env ${name}`);
}

router.post("/signature", (req, res) => {
  try {
    required(CLOUDINARY_CLOUD_NAME, "CLOUDINARY_CLOUD_NAME");
    required(CLOUDINARY_API_KEY, "CLOUDINARY_API_KEY");
    required(CLOUDINARY_API_SECRET, "CLOUDINARY_API_SECRET");

    const folder = (req.body?.folder || "blogs").toString();
    const timestamp = Math.floor(Date.now() / 1000);

    // Cloudinary signed upload string (alphabetized keys)
    const toSign = `folder=${folder}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(toSign + CLOUDINARY_API_SECRET)
      .digest("hex");

    res.json({
      timestamp,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      cloudName: CLOUDINARY_CLOUD_NAME, // optional for debugging
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Signature error" });
  }
});

module.exports = router;
