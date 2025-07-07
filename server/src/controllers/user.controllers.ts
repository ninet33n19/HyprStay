import type { Request, Response } from "express";
import { createUser, getAllUsers, getUserById } from "../services/user.service";
import { CreateUserSchema } from "../models/users.model";
import type fileUpload from "express-fileupload";
import path from "path";

export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const userDate = CreateUserSchema.parse(req.body);

        const user = await createUser(userDate);
        res.status(201).json(user);
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllUsersHandler = async (_req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        if (typeof userId !== "string" || userId.trim() === "") {
            res.status(400).json({ error: "User ID is required" });
            return;
        }

        const user = await getUserById(userId);

        res.status(201).json(user);
    } catch (error: any) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const uploadAvatarHandler = async (req: Request, res: Response) => {
    if (!req.files || !req.files.avatar) {
        res.status(400).json({ message: "No avatar file uploaded" });
        return;
    }

    const avatar = req.files.avatar as fileUpload.UploadedFile;
    const uploadPath = path.join(__dirname, "../../uploads", avatar.name);

    try {
        await avatar.mv(uploadPath);
        // Optionally save path in DB here
        res.status(200).json({
            message: "Upload successful",
            filename: avatar.name,
        });
    } catch (err) {
        res.status(500).json({ message: "Upload failed", error: err });
    }
};
