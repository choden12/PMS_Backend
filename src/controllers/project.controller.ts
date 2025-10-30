import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createProject = async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate, teamSize } = req.body;
  const ownerId = req.user!.id;

  const project = await prisma.project.create({
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined, teamSize: teamSize || 1, ownerId }
  });
  res.status(201).json(project);
};

export const getProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    include: { tasks: true, owner: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(projects);
};

export const getProjectById = async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true, owner: { select: { id: true, name: true } } }
  });
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
};

// summary for dashboard cards
export const getSummary = async (req: Request, res: Response) => {
  const now = new Date();

  const totalProjects = await prisma.project.count();
  const activeProjects = await prisma.project.count({ where: { progress: { lt: 100 } } });
  const totalTasks = await prisma.task.count();
  const completedTasks = await prisma.task.count({ where: { status: "COMPLETED" } });
  const overdueTasks = await prisma.task.count({ where: { dueDate: { lt: now }, status: { not: "COMPLETED" } } });

  res.json({ totalProjects, activeProjects, totalTasks, completedTasks, overdueTasks });
};
