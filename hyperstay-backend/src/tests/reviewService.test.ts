import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../db/client";
import {
    createReview,
    getReviewsByListingId,
} from "../services/review.service";
import type { CreateReview } from "../models/review.model";

vi.mock("../db/client", () => ({
    prisma: {
        booking: {
            findFirst: vi.fn(),
        },
        review: {
            create: vi.fn(),
            findMany: vi.fn(),
        },
    },
}));

const mockCreateReviewInput: CreateReview = {
    listingId: "listing-id-123",
    guestId: "guest-id-123",
    rating: 5,
    comment: "Amazing stay! Highly recommended.",
};

const mockBooking = {
    id: "booking-id-123",
    listingId: "listing-id-123",
    guestId: "guest-id-123",
    isBooked: true,
    checkIn: new Date("2024-01-01"),
    checkOut: new Date("2024-01-05"),
    totalPrice: 1000,
};

const mockReview = {
    id: "review-id-123",
    listingId: "listing-id-123",
    guestId: "guest-id-123",
    rating: 5,
    comment: "Amazing stay! Highly recommended.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
};

const mockReviewsWithGuest = [
    {
        ...mockReview,
        guest: {
            id: "guest-id-123",
            name: "John Doe",
            email: "john@example.com",
            role: "guest",
        },
    },
    {
        id: "review-id-456",
        listingId: "listing-id-123",
        guestId: "guest-id-456",
        rating: 4,
        comment: "Good experience overall.",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
        guest: {
            id: "guest-id-456",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "guest",
        },
    },
];

describe("ReviewService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createReview", () => {
        it("should create a review successfully when guest has a booking", async () => {
            // Mock finding a valid booking
            (
                prisma.booking.findFirst as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockBooking);

            // Mock creating the review
            (
                prisma.review.create as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockReview);

            const result = await createReview(
                mockCreateReviewInput,
                "guest-id-123",
            );

            expect(prisma.booking.findFirst).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-123",
                    guestId: "guest-id-123",
                    isBooked: true,
                },
            });

            expect(prisma.review.create).toHaveBeenCalledWith({
                data: {
                    listingId: "listing-id-123",
                    guestId: "guest-id-123",
                    rating: 5,
                    comment: "Amazing stay! Highly recommended.",
                },
            });

            expect(result).toEqual(mockReview);
        });

        it("should throw an error when guest has no booking for the listing", async () => {
            // Mock no booking found
            (
                prisma.booking.findFirst as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(null);

            await expect(
                createReview(mockCreateReviewInput, "guest-id-123"),
            ).rejects.toThrow("You can only review listings you have booked.");

            expect(prisma.booking.findFirst).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-123",
                    guestId: "guest-id-123",
                    isBooked: true,
                },
            });

            expect(prisma.review.create).not.toHaveBeenCalled();
        });

        it("should throw an error when guest has an unbooked booking", async () => {
            // Mock no booking found (because unbooked bookings are filtered out by isBooked: true)
            (
                prisma.booking.findFirst as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(null);

            await expect(
                createReview(mockCreateReviewInput, "guest-id-123"),
            ).rejects.toThrow("You can only review listings you have booked.");

            expect(prisma.booking.findFirst).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-123",
                    guestId: "guest-id-123",
                    isBooked: true,
                },
            });

            expect(prisma.review.create).not.toHaveBeenCalled();
        });

        it("should create a review without comment", async () => {
            const inputWithoutComment: CreateReview = {
                listingId: "listing-id-123",
                guestId: "guest-id-123",
                rating: 4,
            };

            const reviewWithoutComment = {
                ...mockReview,
                rating: 4,
                comment: undefined,
            };

            (
                prisma.booking.findFirst as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockBooking);

            (
                prisma.review.create as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(reviewWithoutComment);

            const result = await createReview(
                inputWithoutComment,
                "guest-id-123",
            );

            expect(prisma.review.create).toHaveBeenCalledWith({
                data: {
                    listingId: "listing-id-123",
                    guestId: "guest-id-123",
                    rating: 4,
                    comment: undefined,
                },
            });

            expect(result).toEqual(reviewWithoutComment);
        });
    });

    describe("getReviewsByListingId", () => {
        it("should return all reviews for a listing with guest information", async () => {
            (
                prisma.review.findMany as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(mockReviewsWithGuest);

            const result = await getReviewsByListingId("listing-id-123");

            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-123",
                },
                include: {
                    guest: true,
                },
            });

            expect(result).toEqual(mockReviewsWithGuest);
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("guest");
            expect((result[0] as any).guest.name).toBe("John Doe");
            expect((result[1] as any).guest.name).toBe("Jane Smith");
        });

        it("should return empty array when no reviews exist for listing", async () => {
            (
                prisma.review.findMany as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue([]);

            const result = await getReviewsByListingId(
                "listing-id-nonexistent",
            );

            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-nonexistent",
                },
                include: {
                    guest: true,
                },
            });

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });

        it("should handle different listing IDs correctly", async () => {
            const differentListingReviews = [
                {
                    ...mockReview,
                    id: "review-id-different",
                    listingId: "listing-id-456",
                    guest: {
                        id: "guest-id-789",
                        name: "Different Guest",
                        email: "different@example.com",
                        role: "guest",
                    },
                },
            ];

            (
                prisma.review.findMany as unknown as ReturnType<typeof vi.fn>
            ).mockResolvedValue(differentListingReviews);

            const result = await getReviewsByListingId("listing-id-456");

            expect(prisma.review.findMany).toHaveBeenCalledWith({
                where: {
                    listingId: "listing-id-456",
                },
                include: {
                    guest: true,
                },
            });

            expect(result).toEqual(differentListingReviews);
            expect(result[0]?.listingId).toBe("listing-id-456");
        });
    });
});
