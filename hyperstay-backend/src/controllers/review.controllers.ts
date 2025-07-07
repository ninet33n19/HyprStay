import { asyncHandler } from "../middleware/error.middleware";
import { CreateReviewSchema } from "../models/review.model";
import {
    createReview,
    getReviewsByListingId,
} from "../services/review.service";
import type { Request, Response } from "express";

export const createReviewHandler = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const guestId = req.user.id;
        const reviewData = CreateReviewSchema.parse(req.body);
        const review = await createReview(reviewData, guestId);
        res.status(201).json(review);
    },
);

export const getReviewsByListingIdHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const listingId = req.params.listingId;
        if (!listingId) {
            return res.status(400).json({ error: "Listing ID is required" });
        }
        const reviews = await getReviewsByListingId(listingId);
        res.status(200).json(reviews);
    },
);
