import { Router } from "express";
import { prisma } from "../index"; // import your prisma client
import bcrypt from "bcryptjs";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    console.error("Registration error:", error); // 👈 shows real error in terminal
    res.status(500).json({ error: error.message || "Something went wrong" }); // 👈 sends real error message to Postman
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (error: any) {
    console.error("Login error:", error); // 👈 shows real error in terminal
    res.status(500).json({ error: error.message || "Something went wrong" }); // 👈 sends real error message to Postman
  }
});

export default router;
