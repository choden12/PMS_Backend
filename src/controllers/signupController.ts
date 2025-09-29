import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

// POST /api/signup  → create new user
export const signupUser = async (req: Request, res: Response) => {
  try {
    const { company_name, email, first_name, last_name, password } = req.body;

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 6);

    // save user
    const newUser = await prisma.user.create({
      data: {
        company_name,
        email,
        first_name,
        last_name,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// GET /api/signup  → fetch all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        company_name: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        remember_me: true,
        created_at: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};
