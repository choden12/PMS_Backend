import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, status, dueDate, projectId, assigneeId } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: "Missing fields" });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
      assigneeId
    }
  });
  res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
  // optional query filters: projectId, assigneeId, status
  const where: any = {};
  if (req.query.projectId) where.projectId = String(req.query.projectId);
  if (req.query.assigneeId) where.assigneeId = String(req.query.assigneeId);
  if (req.query.status) where.status = String(req.query.status);

  const tasks = await prisma.task.findMany({
    where,
    include: { project: true, assignee: { select: { id: true, name: true } } },
    orderBy: { dueDate: "asc" }
  });
  res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const task = await prisma.task.findUnique({ where: { id }, include: { project: true, assignee: true } });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const id = String(req.params.id);
  const data = req.body;
  const updated = await prisma.task.update({ where: { id }, data });
  res.json(updated);
};
