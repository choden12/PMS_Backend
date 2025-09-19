import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { company_name, email, first_name, last_name, password, remember_me } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 6);

    // Create user
    const user = await prisma.user.create({
      data: {
        company_name,
        email,
        first_name,
        last_name,
        password: hashedPassword,
        remember_me: remember_me || false,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
