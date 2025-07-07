import type { Request, Response } from "express";
import { createListing, getAllListings } from "../services/listing.service";
import { CreateListingSchema } from "../models/listing.model";
import { asyncHandler } from "../middleware/error.middleware";
import { prisma } from "../db/client";

export const createListingHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const listingData = CreateListingSchema.parse(req.body);
        const ownerId = req.user?.id;

        if (!ownerId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const listing = await createListing({ ...listingData, ownerId });
        res.status(201).json(listing);
    },
);

export const getAllListingsHandler = asyncHandler(
    async (_req: Request, res: Response) => {
        const listings = await getAllListings();
        res.status(200).json(listings);
    },
);

export const getBookedDatesHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const { listingId } = req.params;

        if (!listingId) {
            res.status(400).json({ error: "Listing ID is required" });
            return;
        }

        const bookedDates = await prisma.booking.findMany({
            where: {
                listingId,
                isBooked: true,
            },
            select: {
                checkIn: true,
                checkOut: true,
            },
        });

        res.status(200).json(bookedDates);
    },
);
