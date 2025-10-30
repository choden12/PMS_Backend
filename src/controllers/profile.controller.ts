import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...rest } = user as any;
  res.json(rest);
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const data = req.body;

  const allowed: any = {};
  if (data.name) allowed.name = data.name;
  if (data.bio) allowed.bio = data.bio;
  if (data.location) allowed.location = data.location;
  if (Array.isArray(data.skills)) allowed.skills = data.skills;
  if (data.githubUrl) allowed.githubUrl = data.githubUrl;
  if (data.portfolioUrl) allowed.portfolioUrl = data.portfolioUrl;

  const updated = await prisma.user.update({ where: { id: userId }, data: allowed });
  const { passwordHash, ...rest } = updated as any;
  res.json(rest);
};

export const getProfiles = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const search = String(req.query.search || "").trim();

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { bio: { contains: search, mode: "insensitive" } },
      { skills: { has: search } }
    ];
  }

  const total = await prisma.user.count({ where });
  const profiles = await prisma.user.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, bio: true, skills: true, githubUrl: true, portfolioUrl: true, location: true, createdAt: true
    }
  });

  res.json({ meta: { page, limit, total }, data: profiles });
};
