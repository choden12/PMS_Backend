import type { Request, Response } from "express"
import prisma from "../config/database"
import type { ApiResponse, Admin } from "../types"

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
    })

    const response: ApiResponse<Admin[]> = {
      success: true,
      data: admins,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching admins:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch admins",
    })
  }
}

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const admin = await prisma.admin.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      })
    }

    const response: ApiResponse<Admin> = {
      success: true,
      data: admin,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching admin:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch admin",
    })
  }
}

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, about, workAssign, avatarUrl } = req.body

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        about,
        workAssign,
        avatarUrl,
      },
    })

    const response: ApiResponse<Admin> = {
      success: true,
      data: admin,
      message: "Admin created successfully",
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error creating admin:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create admin",
    })
  }
}

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, email, about, workAssign, avatarUrl } = req.body

    const admin = await prisma.admin.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        email,
        about,
        workAssign,
        avatarUrl,
      },
    })

    const response: ApiResponse<Admin> = {
      success: true,
      data: admin,
      message: "Admin updated successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error updating admin:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update admin",
    })
  }
}

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.admin.delete({
      where: { id: Number.parseInt(id) },
    })

    const response: ApiResponse<null> = {
      success: true,
      message: "Admin deleted successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error deleting admin:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete admin",
    })
  }
}
