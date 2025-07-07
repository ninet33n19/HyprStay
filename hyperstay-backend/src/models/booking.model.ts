import { z } from "zod";

export const CreateBookingSchema = z.object({
    listingId: z.string().uuid("Invalid listing ID"),
    checkIn: z.coerce.date().refine((date) => date > new Date(), {
        message: "Check-in must be in the future",
    }),
    checkOut: z.coerce.date().refine((date) => date > new Date(), {
        message: "Check-out must be in the future",
    }),
    totalPrice: z.number().min(0, "Total price must be non-negative"),
    isBooked: z.boolean().optional(),
});

export const BookingDatesSchema = z
    .object({
        checkIn: z.coerce.date(),
        checkOut: z.coerce.date(),
    })
    .refine((data) => data.checkOut > data.checkIn, {
        message: "Check-out must be after check-in",
    });

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
