import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../db/client";
import { createListing } from "../services/listing.service";
import type { ListingType } from "@prisma/client";

vi.mock("../db/client", () => ({
    prisma: {
        listing: {
            create: vi.fn(),
            findMany: vi.fn(),
            findFirst: vi.fn(),
        },
        user: {
            findUnique: vi.fn(),
        },
    },
}));

const fakeInput = {
    title: "Ocean View Villa",
    description: "Beautiful sea-facing property",
    type: "entire" as ListingType,
    location: "Goa",
    country: "India",
    price: 12000,
    bedrooms: 3,
    bathrooms: 2,
    ownerId: "user-id-123",
};

describe("ListingService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("creates a listing successfully", async () => {
        (
            prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() =>
            Promise.resolve({
                id: "user-id-123",
            }),
        );
        (
            prisma.listing.create as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() =>
            Promise.resolve({
                id: "listing-id-1",
                ...fakeInput,
            }),
        );

        const result = await createListing(fakeInput);

        expect(result.title).toBe(fakeInput.title);
        expect(prisma.listing.create).toHaveBeenCalledWith({
            data: {
                ...fakeInput,
                amenities: {
                    create: [],
                },
            },
        });
    });

    it("throws if owner not found", async () => {
        (
            prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
        ).mockImplementation(() => Promise.resolve(null));

        await expect(createListing(fakeInput)).rejects.toThrow(
            "Owner ID must be a valid host user ID",
        );
    });
});
