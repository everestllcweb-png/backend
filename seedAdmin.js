// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin"); // <-- Ensure correct path to your Admin model

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ username: "Santosh" });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Seed skipped.");
      return process.exit(0);
    }

    console.log("Creating admin user...");

    const hashedPassword = await bcrypt.hash("EverestLLC@2058#", 10);

    await Admin.create({
      username: "Santosh",
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully!");
    console.log("👤 Username: Santosh");
    console.log("🔐 Password: EverestLLC@2058#");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
