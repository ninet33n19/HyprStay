import { z } from "zod";

export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["guest", "host"]),
});

export const LoginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password is required"),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
