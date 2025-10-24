import express, { type Application, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import projectRoutes from "./routes/projectRoutes"
import selectionProjectRoutes from "./routes/selectionProjectRoutes"
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

//  Welcome route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Admin Dashboard Backend API!",
  })
})

// API Routes
app.use("/api/projects", projectRoutes)
app.use("/api/selectionprojects", selectionProjectRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  })
})

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export default app
