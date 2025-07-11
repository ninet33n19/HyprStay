import "express";

declare module "express" {
    interface Request {
        user?: {
            id: string;
            role: "guest" | "host";
        };
    }
}
