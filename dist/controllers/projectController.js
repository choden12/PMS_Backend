"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStats = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllProjects = async (req, res) => {
    try {
        const projects = await database_1.default.project.findMany({
            orderBy: { createdAt: "desc" },
        });
        const response = {
            success: true,
            data: projects,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch projects",
        });
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await database_1.default.project.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Project not found",
            });
        }
        const response = {
            success: true,
            data: project,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch project",
        });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { name, status, progress, invoice, startDate, endDate, deadline, priority } = req.body;
        const project = await database_1.default.project.create({
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
        });
        const response = {
            success: true,
            data: project,
            message: "Project created successfully",
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create project",
        });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status, progress, invoice, startDate, endDate, deadline, priority } = req.body;
        const project = await database_1.default.project.update({
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
        });
        const response = {
            success: true,
            data: project,
            message: "Project updated successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update project",
        });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.project.delete({
            where: { id: Number.parseInt(id) },
        });
        const response = {
            success: true,
            message: "Project deleted successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete project",
        });
    }
};
exports.deleteProject = deleteProject;
const getProjectStats = async (req, res) => {
    try {
        const [toDo, inProgress, pendingInvoice, done] = await Promise.all([
            database_1.default.project.count({ where: { status: "To Do" } }),
            database_1.default.project.count({ where: { status: "In Progress" } }),
            database_1.default.project.count({ where: { invoice: { lt: 100 } } }),
            database_1.default.project.count({ where: { status: "Done" } }),
        ]);
        const response = {
            success: true,
            data: {
                toDo,
                inProgress,
                pendingInvoice,
                done,
            },
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching project stats:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch project statistics",
        });
    }
};
exports.getProjectStats = getProjectStats;
