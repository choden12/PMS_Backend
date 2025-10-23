import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// 🟢 Get all users
export const getUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

// 🟢 Add user
export const addUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({ data: req.body });
  res.json(user);
};

// 🟢 Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: req.body,
  });
  res.json(user);
};
