"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAdminById = exports.getAllAdmins = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllAdmins = async (req, res) => {
    try {
        const admins = await database_1.default.admin.findMany({
            orderBy: { createdAt: "desc" },
        });
        const response = {
            success: true,
            data: admins,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch admins",
        });
    }
};
exports.getAllAdmins = getAllAdmins;
const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await database_1.default.admin.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!admin) {
            return res.status(404).json({
                success: false,
                error: "Admin not found",
            });
        }
        const response = {
            success: true,
            data: admin,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch admin",
        });
    }
};
exports.getAdminById = getAdminById;
const createAdmin = async (req, res) => {
    try {
        const { name, email, about, workAssign, avatarUrl } = req.body;
        const admin = await database_1.default.admin.create({
            data: {
                name,
                email,
                about,
                workAssign,
                avatarUrl,
            },
        });
        const response = {
            success: true,
            data: admin,
            message: "Admin created successfully",
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create admin",
        });
    }
};
exports.createAdmin = createAdmin;
const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, about, workAssign, avatarUrl } = req.body;
        const admin = await database_1.default.admin.update({
            where: { id: Number.parseInt(id) },
            data: {
                name,
                email,
                about,
                workAssign,
                avatarUrl,
            },
        });
        const response = {
            success: true,
            data: admin,
            message: "Admin updated successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update admin",
        });
    }
};
exports.updateAdmin = updateAdmin;
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.admin.delete({
            where: { id: Number.parseInt(id) },
        });
        const response = {
            success: true,
            message: "Admin deleted successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete admin",
        });
    }
};
exports.deleteAdmin = deleteAdmin;
