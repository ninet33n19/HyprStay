import z from "zod";

export const CreateReviewSchema = z.object({
    listingId: z.string().uuid(),
    guestId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1).max(500).optional(),
});

export type CreateReview = z.infer<typeof CreateReviewSchema>;
