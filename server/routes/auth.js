import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../db/db.js";
import { createToken } from "../utils/createToken.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authSchema, loginSchema } from "../utils/validationSchemas.js";

const router = Router();

// Current user endpoint used by checkAuth
router.get("/me", authMiddleware, (req, res) => {
  // req.user comes from the token payload
  res.json({
    user: {
      userId: req.user.userId,
      username: req.user.username,
    },
  });
});

router.post("/login", async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: validation.error.issues 
    });
  }

  const { username, password } = validation.data;

  try {
    // find user
    const existingUser = await db.query(
      "SELECT id, username, password, created_at FROM users WHERE username = $1",
      [username]
    );

    const user = existingUser.rows[0];

    if (!user) {
      return res.status(400).json({
        error: "User not found.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        error: "Incorrect password",
      });
    }

    const token = createToken(user);

    res.json({
      user: {
        userId: user.id,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error("Failed to login:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const validation = authSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: validation.error.issues.map(i => i.message).join(", ")
      });
    }
    
    const { username, password, email } = validation.data;

    //check if email already exists

    const existingEmail = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length >0)
    {
      return res.status(409).json({
        error: "The email address is already registered.",
      });
    }

    const existingUser = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    // check if user exist
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "The username already exist",
      });
    }

    const hash_password = await bcrypt.hash(password, 10);

    // Insert the new user
    const newUser = await db.query(
      "INSERT INTO users (username, password,email) VALUES ($1, $2,$3) RETURNING id, username,email, created_at",
      [username, hash_password,email]
    );

    const user = newUser.rows[0];

    const token = createToken(user);

    res.status(201).json({
      user: {
        userId: user.id,
        username: user.username,
        email:user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (err) {
    console.error("Failed to sign up", err);
    res.status(500).json({ error: "Failed to sign up" });
  }
});

router.post("/logout", authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Logged out" });
});

export default router;