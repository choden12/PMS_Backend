"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const selectionProjectRoutes_1 = __importDefault(require("./routes/selectionProjectRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Admin Dashboard API is running",
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/selection-projects", selectionProjectRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/admins", adminRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: err.message || "Internal server error",
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
exports.default = app;
