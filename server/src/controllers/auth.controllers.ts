import type { Request, Response } from "express";
import { signup, login } from "../services/auth.service";
import { SignupSchema, LoginSchema } from "../models/auth.model";
import { prisma } from "../db/client";
import { asyncHandler } from "../middleware/error.middleware";

export const signupHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const signupData = SignupSchema.parse(req.body);
        const { token, user } = await signup(signupData);
        res.status(201).json({ token, user });
    },
);

export const loginHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const loginData = LoginSchema.parse(req.body);
        const { token, user } = await login(loginData);
        res.status(200).json({ token, user });
    },
);

export const getMeHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    },
);
