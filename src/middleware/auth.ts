import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { JwtPayload } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please login first.",
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

      // Attach admin info to request
      req.admin = {
        id: decoded.adminId,
        email: decoded.email,
        name: "",
      }

      next()
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token. Please login again.",
      })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    })
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.admin = {
          id: decoded.adminId,
          email: decoded.email,
          name: "",
        }
      } catch (jwtError) {
        // Token invalid but continue anyway
      }
    }

    next()
  } catch (error) {
    next()
  }
}
