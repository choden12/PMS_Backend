import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

function signToken(id: string, email: string, role?: string) {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d"; // Default to "7d" if not set
  return jwt.sign({ id, email, role }, secret, { expiresIn } as jwt.SignOptions);
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email already registered" });

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  });

  const token = signToken(user.id, user.email, user.role);
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = signToken(user.id, user.email, user.role);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
};
