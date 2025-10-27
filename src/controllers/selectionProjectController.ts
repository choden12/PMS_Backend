import type { Request, Response } from "express"
import prisma from "../config/database"
import type { ApiResponse, SelectionProject } from "../types"
import fs from "fs"
import path from "path"

export const getAllSelectionProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.selectionProject.findMany({
      orderBy: { createdAt: "desc" },
    })

    const response: ApiResponse<SelectionProject[]> = {
      success: true,
      data: projects.map((project) => ({
        ...project,
        startDate: project.startDate === null ? undefined : project.startDate,
        endDate: project.endDate === null ? undefined : project.endDate,
        manager: project.manager === null ? undefined : project.manager,
      })),
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching selection projects:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch selection projects",
    })
  }
}

export const getSelectionProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const project = await prisma.selectionProject.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Selection project not found",
      })
    }

    const response: ApiResponse<SelectionProject> = {
      success: true,
      data: project,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching selection project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch selection project",
    })
  }
}

export const createSelectionProject = async (req: Request, res: Response) => {
  try {
    const { name, status, startDate, endDate, manager, budget } = req.body
    const file = req.file

    const project = await prisma.selectionProject.create({
      data: {
        name,
        status: status || "Pending",
        startDate,
        endDate,
        manager,
        budget: Number.parseFloat(budget) || 0,
        pdfUrl: file ? `/uploads/${file.filename}` : null,
        pdfName: file ? file.originalname : null,
      },
    })

    const response: ApiResponse<SelectionProject> = {
      success: true,
      data: project,
      message: "Selection project created successfully",
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error creating selection project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create selection project",
    })
  }
}

export const updateSelectionProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, status, startDate, endDate, manager, budget } = req.body
    const file = req.file

    // Get existing project to delete old PDF if new one is uploaded
    const existingProject = await prisma.selectionProject.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: "Selection project not found",
      })
    }

    // Delete old PDF if new one is uploaded
    if (file && existingProject.pdfUrl) {
      const oldFilePath = path.join(process.cwd(), existingProject.pdfUrl)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    }

    const project = await prisma.selectionProject.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        status,
        startDate,
        endDate,
        manager,
        budget: budget ? Number.parseFloat(budget) : existingProject.budget,
        pdfUrl: file ? `/uploads/${file.filename}` : existingProject.pdfUrl,
        pdfName: file ? file.originalname : existingProject.pdfName,
      },
    })

    const response: ApiResponse<SelectionProject> = {
      success: true,
      data: project,
      message: "Selection project updated successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error updating selection project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update selection project",
    })
  }
}

export const deleteSelectionProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const project = await prisma.selectionProject.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Selection project not found",
      })
    }

    // Delete PDF file if exists
    if (project.pdfUrl) {
      const filePath = path.join(process.cwd(), project.pdfUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await prisma.selectionProject.delete({
      where: { id: Number.parseInt(id) },
    })

    const response: ApiResponse<null> = {
      success: true,
      message: "Selection project deleted successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error deleting selection project:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete selection project",
    })
  }
}
