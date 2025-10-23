import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// 🟢 Get all projects
export const getProjects = async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
};

// 🟢 Add new project
export const addProject = async (req: Request, res: Response) => {
  const project = await prisma.project.create({ data: req.body });
  res.json(project);
};

// 🟢 Update project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: req.body,
  });
  res.json(project);
};

// 🟢 End project (mark as done)
export const endProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        status: "Done",
        progress: 100,
      },
    });
    res.json({ message: "Project marked as completed", project });
  } catch (error) {
    res.status(400).json({ error: "Unable to end project" });
  }
};
