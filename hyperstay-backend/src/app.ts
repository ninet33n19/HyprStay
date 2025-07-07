import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import listingRouter from "./routes/listing.routes";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import fileUpload from "express-fileupload";
import bookingRouter from "./routes/booking.routes";
import reviewRouter from "./routes/review.routes";

const app = express();

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(fileUpload());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/hotels", listingRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);

app.get("/health", (_req, res) => {
    res.send("OK");
});

// error handling middleware (should be last because it catches all errors)
app.use(errorHandler);

export default app;
