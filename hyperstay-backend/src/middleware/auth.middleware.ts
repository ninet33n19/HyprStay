import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

interface JwtPayload {
    userId: string;
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        req.user = { id: user.id, role: user.role };
        next();
    } catch (error: any) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
};
