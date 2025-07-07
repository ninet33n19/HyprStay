import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/error.middleware";
import { CreateBookingSchema } from "../models/booking.model";
import { createBooking } from "../services/booking.service";
import { prisma } from "../db/client";

export const createBookingHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const bookingData = CreateBookingSchema.parse(req.body);
        const guestId = req.user?.id;

        if (!guestId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const booking = await createBooking(bookingData, guestId);

        res.status(201).json(booking);
    },
);

export const getBookingsHandler = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId || !role) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (role === "guest") {
            const bookings = await prisma.booking.findMany({
                where: { guestId: userId },
                include: { listing: true },
            });
            res.status(200).json(bookings);
        } else {
            const bookings = await prisma.booking.findMany({
                where: { listing: { ownerId: userId } },
                include: { guest: true, listing: true },
            });
            res.status(200).json(bookings);
        }
    },
);
