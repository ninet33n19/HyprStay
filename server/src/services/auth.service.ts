import type { SignupInput, LoginInput } from "../models/auth.model";
import { prisma } from "../db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConflictError } from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET || "default";
const SALT_ROUNDS = 10;

export const signup = async (input: SignupInput) => {
    const { name, email, password, role } = input;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    return { token, user };
};

export const login = async (input: LoginInput) => {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ConflictError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ConflictError("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
    });

    // Return user data without password
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return { token, user: userData };
};
