import type { Request, Response } from "express"
import prisma from "../config/database"
import type { ApiResponse, Project } from "../types"

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    })

    const response: ApiResponse<Project[]> = {
      success: true,
      data: projects,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching projects:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch projects",
    })
  }
}

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = await prisma.project.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      })
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: project,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch project",
    })
  }
}

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, status, progress, invoice, startDate, endDate, deadline, priority } = req.body

    const project = await prisma.project.create({
      data: {
        name,
        status: status || "To Do",
        progress: progress || 0,
        invoice: invoice || 0,
        startDate,
        endDate,
        deadline,
        priority: priority || "Medium",
      },
    })

    const response: ApiResponse<Project> = {
      success: true,
      data: project,
      message: "Project created successfully",
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error creating project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create project",
    })
  }
}

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, status, progress, invoice, startDate, endDate, deadline, priority } = req.body

    const project = await prisma.project.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        status,
        progress,
        invoice,
        startDate,
        endDate,
        deadline,
        priority,
      },
    })

    const response: ApiResponse<Project> = {
      success: true,
      data: project,
      message: "Project updated successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error updating project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update project",
    })
  }
}

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.project.delete({
      where: { id: Number.parseInt(id) },
    })

    const response: ApiResponse<null> = {
      success: true,
      message: "Project deleted successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error deleting project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete project",
    })
  }
}

export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const [toDo, inProgress, pendingInvoice, done] = await Promise.all([
      prisma.project.count({ where: { status: "To Do" } }),
      prisma.project.count({ where: { status: "In Progress" } }),
      prisma.project.count({ where: { invoice: { lt: 100 } } }),
      prisma.project.count({ where: { status: "Done" } }),
    ])

    const response: ApiResponse<any> = {
      success: true,
      data: {
        toDo,
        inProgress,
        pendingInvoice,
        done,
      },
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching project stats:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch project statistics",
    })
  }
}
