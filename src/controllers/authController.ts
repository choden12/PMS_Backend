import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { Secret, SignOptions } from "jsonwebtoken"
import prisma from "../config/database"
import type { LoginRequest, RegisterRequest, JwtPayload } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: RegisterRequest = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      })
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "Admin with this email already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      } as any,
    })

    // Generate JWT token
    const token = jwt.sign({ adminId: admin.id, email: admin.email } as JwtPayload, JWT_SECRET as Secret, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions)

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: adminWithoutPassword,
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to register admin",
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      })
    }

    // Find admin with all fields
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        about: true,
        workAssign: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin.id, email: admin.email } as JwtPayload, JWT_SECRET as Secret, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions)

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: adminWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to login",
    })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        workAssign: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      })
    }

    res.json({
      success: true,
      data: admin,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get profile",
    })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      })
    }

    const { name, about, workAssign, avatarUrl } = req.body

    const updatedAdmin = await prisma.admin.update({
      where: { id: req.admin.id },
      data: {
        ...(name && { name }),
        ...(about !== undefined && { about }),
        ...(workAssign !== undefined && { workAssign }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        about: true,
        workAssign: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update profile",
    })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated",
      })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      })
    }

    // Get admin with all fields
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        about: true,
        workAssign: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.admin.update({
      where: { id: req.admin.id },
      data: { password: hashedPassword } as any,
    })

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    })
  }
}
