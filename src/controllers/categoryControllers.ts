import { Request, Response } from "express";
import Category from "../models/categoriesModel";

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json({
            status: "success",
            data: categories,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({
                status: "error",
                message: "category not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: category,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description, photo } = req.body;
        const category = await Category.create({
            name,
            description,
            photo
        });
        await category.save();
        res.status(201).json({
            status: "success",
            data: category,
        });
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({
                status: "error",
                message: "category not found",
            });
        } else {
            await category.update(req.body);
            await category.save();
            res.status(200).json({
                status: "success",
                data: category,
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            res.status(404).json({
                status: "error",
                message: "category not found",
            });
        } else {
            await category.destroy();
            await category.save();
            res.status(200).json({
                status: "success",
                message: "category deleted successfully",
            });
        }
    } catch (error: any) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};