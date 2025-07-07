import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/authorize.middleware";
import {
    createReviewHandler,
    getReviewsByListingIdHandler,
} from "../controllers/review.controllers";

const reviewRouter = Router();

reviewRouter.get("/:listingId", getReviewsByListingIdHandler);
reviewRouter.post("/", authenticate, authorize(["guest"]), createReviewHandler);

export default reviewRouter;
