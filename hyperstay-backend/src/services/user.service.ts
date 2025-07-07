import { prisma } from "../db/client";
import type { User } from "@prisma/client";
import type { CreateUser } from "../models/users.model";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const createUser = async (userData: CreateUser): Promise<User> => {
    const { name, email, role, password } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
        },
    });

    return user;
};

export const getAllUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    return user;
};
