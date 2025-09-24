import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getDashboardStats = async (_: Request, res: Response) => {
  const todo = await prisma.project.count({ where: { status: "todo" } });
  const inProgress = await prisma.project.count({ where: { status: "in_progress" } });
  const done = await prisma.project.count({ where: { status: "done" } });
  const pendingInvoice = await prisma.project.count({ where: { invoiceStatus: "pending" } });
  res.json({ todo, inProgress, done, pendingInvoice });
};
