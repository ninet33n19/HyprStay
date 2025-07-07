import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
    createListingHandler,
    getAllListingsHandler,
    getBookedDatesHandler,
} from "../controllers/listing.controllers";

const listingRouter = Router();

listingRouter.get("/", getAllListingsHandler);
listingRouter.get("/:listingId/booked-dates", getBookedDatesHandler);
listingRouter.post(
    "/",
    authenticate,
    authorize(["host"]),
    createListingHandler,
);

export default listingRouter;
