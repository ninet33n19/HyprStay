import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["host", "guest"]),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
