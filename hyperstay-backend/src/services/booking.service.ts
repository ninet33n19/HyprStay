import { prisma } from "../db/client";
import type { CreateBookingInput } from "../models/booking.model";

export const checkIsBooked = async (
    listingId: string,
    checkIn: Date,
    checkOut: Date,
): Promise<boolean> => {
    const overlappingBookings = await prisma.booking.findMany({
        where: {
            listingId,
            isBooked: true,
            OR: [
                {
                    checkIn: {
                        // lt = less than
                        // checking if the check-in date of the new booking is before the existing booking's check-out date
                        lt: checkOut,
                    },
                    checkOut: {
                        // gt = greater than
                        // checking if the check-out date of the new booking is after the existing booking's check-in date
                        gt: checkIn,
                    },
                },
            ],
        },
    });

    return overlappingBookings.length === 0;
};

export const createBooking = async (
    input: CreateBookingInput,
    guestId: string,
) => {
    const { listingId, checkIn, checkOut, totalPrice } = input;

    const isAvailable = await checkIsBooked(listingId, checkIn, checkOut);

    if (!isAvailable) {
        throw new Error("Listing is not available for the selected dates.");
    }

    const booking = await prisma.booking.create({
        data: {
            listingId,
            guestId,
            checkIn,
            checkOut,
            totalPrice,
            isBooked: true,
        },
    });

    return booking;
};

export const cancelBooking = async (bookingId: string, userId: string) => {
    const checkBooking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            listing: {
                select: {
                    ownerId: true,
                },
            },
        },
    });

    if (!checkBooking) {
        throw new Error("Booking not found.");
    }

    const isGuest = checkBooking.guestId === userId;
    const isHost = checkBooking.listing.ownerId === userId;

    if (!isGuest && !isHost) {
        throw new Error("You are not authorized to cancel this booking.");
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { isBooked: false },
    });

    return updatedBooking;
};
