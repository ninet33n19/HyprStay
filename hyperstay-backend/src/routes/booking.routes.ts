import { Router } from "express";
import {
    createBookingHandler,
    getBookingsHandler,
} from "../controllers/booking.controllers";
import { authenticate } from "../middleware/auth.middleware";

const bookingRouter = Router();

bookingRouter.post("/", authenticate, createBookingHandler);
bookingRouter.get("/", authenticate, getBookingsHandler);

export default bookingRouter;
