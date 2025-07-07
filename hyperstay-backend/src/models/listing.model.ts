import { ListingType } from "@prisma/client";
import { z } from "zod";

export const CreateListingSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    type: z.nativeEnum(ListingType),
    location: z.string().min(1),
    country: z.string().min(1),
    price: z.number().min(0),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    amenities: z.array(z.string()).optional(),
    ownerId: z.string().uuid().optional(),
});

export type CreateListing = z.infer<typeof CreateListingSchema>;
