// Shared API response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Align types with prisma/schema.prisma:
// - Optional DB string columns (String?) map to string | null
// - Admin includes password
export interface User {
  id: number
  name: string
  role: string
  lastActive?: string | null   // changed: can be null in DB
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface SelectionProject {
  id: number
  name: string
  status: string
  startDate?: string | null   // changed: can be null in DB
  endDate?: string | null     // changed: can be null in DB
  manager?: string | null     // changed: can be null in DB
  budget: number
  pdfUrl?: string | null      // changed: can be null in DB
  pdfName?: string | null     // changed: can be null in DB
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: number
  name: string
  status: string
  progress: number
  invoice: number
  startDate?: string | null
  endDate?: string | null
  deadline?: string | null
  priority: string
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  id: number
  name: string
  email: string
  password: string            // added: present in schema.prisma
  about?: string | null
  workAssign?: string | null
  avatarUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

// Auth request / jwt helper types
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface JwtPayload {
  adminId: number
  email: string
}