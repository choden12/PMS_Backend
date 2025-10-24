import type { Request, Response } from "express"
import prisma from "../config/database"
import type { ApiResponse, User } from "../types"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch users",
    })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      })
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    }

    res.json(response)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    })
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, role, lastActive, status } = req.body

    const user = await prisma.user.create({
      data: {
        name,
        role: role || "Staff",
        lastActive,
        status: status || "Inactive",
      },
    })

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "User created successfully",
    }

    res.status(201).json(response)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, role, lastActive, status } = req.body

    const user = await prisma.user.update({
      where: { id: Number.parseInt(id) },
      data: {
        name,
        role,
        lastActive,
        status,
      },
    })

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "User updated successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.user.delete({
      where: { id: Number.parseInt(id) },
    })

    const response: ApiResponse<null> = {
      success: true,
      message: "User deleted successfully",
    }

    res.json(response)
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    })
  }
}
