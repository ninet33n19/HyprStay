import type { Request, Response, NextFunction } from "express";

export const authorize = (roles: Array<"guest" | "host">) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = (req as any).user?.role;

        if (!role || !roles.includes(role)) {
            res.status(403).json({ message: "Forbidden: Access Denied" });
            return;
        }

        next();
    };
};
