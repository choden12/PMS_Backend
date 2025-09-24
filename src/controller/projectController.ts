import { Request, Response } from "express";
import prisma from "../utils/prisma";

export const getProjects = async (_: Request, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await prisma.project.create({ data: req.body });
  res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: req.body
  });
  res.json(project);
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id: Number(id) } });
  res.json({ message: "Project deleted" });
};
