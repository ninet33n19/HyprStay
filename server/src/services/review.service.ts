import type { Review } from "@prisma/client";
import type { CreateReview } from "../models/review.model";
import { prisma } from "../db/client";

export const createReview = async (
    input: CreateReview,
    guestId: string,
): Promise<Review> => {
    const { listingId, rating, comment } = input;

    const booking = await prisma.booking.findFirst({
        where: {
            listingId,
            guestId: guestId,
            isBooked: true,
        },
    });

    if (!booking) {
        throw new Error("You can only review listings you have booked.");
    }

    const review = await prisma.review.create({
        data: {
            listingId,
            guestId,
            rating,
            comment,
        },
    });

    return review;
};

export const getReviewsByListingId = async (
    listingId: string,
): Promise<Review[]> => {
    const reviews = await prisma.review.findMany({
        where: {
            listingId,
        },
        include: {
            guest: true,
        },
    });

    return reviews;
};
