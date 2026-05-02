import express   from "express";
import UserModel from "../models/user.js";
import bcrypt    from "bcrypt";

const router = express.Router();

// ── POST /register ──
// Creates a new user. Hashes the password before saving.
router.post("/register", async (req, res) => {
  try {
    const { userName, email, password, phoneno, role } = req.body;

    // Reject duplicate emails
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      userName,
      email,
      password: hashedPassword,
      phoneno,
      role, // "customer" (default) or "admin"
    });

    await user.save();
    res.json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error saving user" });
  }
});

// ── POST /login ──
// Verifies credentials and returns the user document on success.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare plaintext password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Return the user object (frontend stores userId, userName, role in Redux)
    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
