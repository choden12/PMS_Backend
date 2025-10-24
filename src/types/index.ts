export interface Project {
  id: number
  name: string
  status: string
  progress: number
  invoice: number
  startDate?: string
  endDate?: string
  deadline?: string
  priority: string
}

export interface SelectionProject {
  id: number
  name: string
  status: string
  startDate?: string
  endDate?: string
  manager?: string
  budget: number
  pdfUrl?: string
  pdfName?: string
}

export interface User {
  id: number
  name: string
  role: string
  lastActive?: string
  status: string
}

export interface Admin {
  id: number
  name: string
  email: string
  about?: string
  workAssign?: string
  avatarUrl?: string
}

export interface AdminWithPassword extends Admin {
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  admin?: Admin
  message?: string
  error?: string
}

export interface JwtPayload {
  adminId: number
  email: string
}

declare global {
  namespace Express {
    interface Request {
      admin?: Admin
    }
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
