import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// 🟢 Get all managers
export const getManagers = async (_req: Request, res: Response) => {
  const managers = await prisma.manager.findMany();
  res.json(managers);
};

// 🟢 Add manager
export const addManager = async (req: Request, res: Response) => {
  const manager = await prisma.manager.create({ data: req.body });
  res.json(manager);
};

// 🟢 Update manager
export const updateManager = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = await prisma.manager.update({
    where: { id: Number(id) },
    data: req.body,
  });
  res.json(manager);
};
