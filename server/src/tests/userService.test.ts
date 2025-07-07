import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { prisma } from "../db/client";
import { createUser, getAllUsers } from "../services/user.service";

describe("UserService", () => {
    beforeAll(async () => {
        await prisma.user.deleteMany();
    });

    it("should create a user", async () => {
        const user = await createUser({
            name: "Test User",
            email: "test@example.com",
            role: "host",
            password: "testpassword",
        });

        expect(user).toHaveProperty("id");
        expect(user.email).toBe("test@example.com");
    });

    it("should return all users", async () => {
        // Ensure at least one user exists before fetching all users
        await createUser({
            name: "Another User",
            email: "another@example.com",
            role: "guest",
            password: "anotherpassword",
        });

        const users = await getAllUsers();
        expect(users.length).toBeGreaterThan(0);
    });

    it("should throw on duplicate email", async () => {
        await expect(() =>
            createUser({
                name: "Dup User",
                email: "test@example.com", // already exists
                role: "guest",
                password: "duppassword",
            }),
        ).rejects.toThrow("User with this email already exists");
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
});
