"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllUsers = async (req, res) => {
    try {
        const users = await database_1.default.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        const response = {
            success: true,
            data: users,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch users",
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await database_1.default.user.findUnique({
            where: { id: Number.parseInt(id) },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }
        const response = {
            success: true,
            data: user,
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user",
        });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { name, role, lastActive, status } = req.body;
        const user = await database_1.default.user.create({
            data: {
                name,
                role: role || "Staff",
                lastActive,
                status: status || "Inactive",
            },
        });
        const response = {
            success: true,
            data: user,
            message: "User created successfully",
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create user",
        });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, lastActive, status } = req.body;
        const user = await database_1.default.user.update({
            where: { id: Number.parseInt(id) },
            data: {
                name,
                role,
                lastActive,
                status,
            },
        });
        const response = {
            success: true,
            data: user,
            message: "User updated successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user",
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.user.delete({
            where: { id: Number.parseInt(id) },
        });
        const response = {
            success: true,
            message: "User deleted successfully",
        };
        res.json(response);
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user",
        });
    }
};
exports.deleteUser = deleteUser;
