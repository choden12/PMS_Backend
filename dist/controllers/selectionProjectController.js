"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSelectionProject = exports.updateSelectionProject = exports.createSelectionProject = exports.getSelectionProjectById = exports.getAllSelectionProjects = void 0;
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllSelectionProjects = async (req, res) => {
    try {
        const projects = await database_1.default.selectionProject.findMany({
            orderBy: { createdAt: "desc" },
        });
        const response = {
            success: true,
            data: projects,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching selection projects:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch selection projects",
        });
    }
};
exports.getAllSelectionProjects = getAllSelectionProjects;
const getSelectionProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await database_1.default.selectionProject.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Selection project not found",
            });
        }
        const response = {
            success: true,
            data: project,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching selection project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch selection project",
        });
    }
};
exports.getSelectionProjectById = getSelectionProjectById;
const createSelectionProject = async (req, res) => {
    try {
        const { name, status, startDate, endDate, manager, budget } = req.body;
        const file = req.file;
        const project = await database_1.default.selectionProject.create({
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
        });
        const response = {
            success: true,
            data: project,
            message: "Selection project created successfully",
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating selection project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create selection project",
        });
    }
};
exports.createSelectionProject = createSelectionProject;
const updateSelectionProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status, startDate, endDate, manager, budget } = req.body;
        const file = req.file;
        // Get existing project to delete old PDF if new one is uploaded
        const existingProject = await database_1.default.selectionProject.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!existingProject) {
            return res.status(404).json({
                success: false,
                error: "Selection project not found",
            });
        }
        // Delete old PDF if new one is uploaded
        if (file && existingProject.pdfUrl) {
            const oldFilePath = path_1.default.join(process.cwd(), existingProject.pdfUrl);
            if (fs_1.default.existsSync(oldFilePath)) {
                fs_1.default.unlinkSync(oldFilePath);
            }
        }
        const project = await database_1.default.selectionProject.update({
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
        });
        const response = {
            success: true,
            data: project,
            message: "Selection project updated successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error updating selection project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update selection project",
        });
    }
};
exports.updateSelectionProject = updateSelectionProject;
const deleteSelectionProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await database_1.default.selectionProject.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!project) {
            return res.status(404).json({
                success: false,
                error: "Selection project not found",
            });
        }
        // Delete PDF file if exists
        if (project.pdfUrl) {
            const filePath = path_1.default.join(process.cwd(), project.pdfUrl);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        await database_1.default.selectionProject.delete({
            where: { id: Number.parseInt(id) },
        });
        const response = {
            success: true,
            message: "Selection project deleted successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error deleting selection project:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete selection project",
        });
    }
};
exports.deleteSelectionProject = deleteSelectionProject;
