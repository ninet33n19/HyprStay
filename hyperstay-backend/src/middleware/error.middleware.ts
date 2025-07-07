import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    console.error("Error:", error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
        res.status(400).json({
            error: "Validation failed",
            details: error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            })),
        });
        return;
    }

    // Handle custom application errors
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: error.message,
        });
        return;
    }

    // Handle unknown errors
    res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
    });
};

// Properly typed async handler
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
