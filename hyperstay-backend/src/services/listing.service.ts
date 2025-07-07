import { prisma } from "../db/client";
import type { Listing } from "@prisma/client";
import type { CreateListing } from "../models/listing.model";
import { ConflictError, ValidationError } from "../utils/errors";

export const createListing = async (
    hotelData: CreateListing,
): Promise<Listing> => {
    const {
        title,
        description,
        type,
        location,
        country,
        price,
        bedrooms,
        bathrooms,
        amenities,
        ownerId,
    } = hotelData;

    const existingListing = await prisma.listing.findFirst({
        where: {
            title,
            location,
            country,
        },
        include: {
            owner: true, // include owner to check if they are a host
        },
    });

    if (existingListing) {
        throw new ConflictError("A hotel already exists at this address");
    }

    const idEqualHost = await prisma.user.findUnique({
        where: {
            id: ownerId,
            role: "host",
        },
    });

    if (!idEqualHost) {
        throw new ValidationError("Owner ID must be a valid host user ID");
    }

    const hotel = await prisma.listing.create({
        data: {
            title,
            description,
            type,
            location,
            country,
            price,
            bedrooms,
            bathrooms,
            ownerId,
            amenities: {
                create: (amenities ?? []).map((a) => ({ name: a })),
            },
        },
    });

    return hotel;
};

export const getAllListings = async (): Promise<Listing[]> => {
    return await prisma.listing.findMany({
        include: {
            amenities: true,
        },
    });
};
