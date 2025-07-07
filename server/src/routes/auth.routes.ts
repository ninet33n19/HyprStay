import { Router } from "express";
import {
    signupHandler,
    loginHandler,
    getMeHandler,
} from "../controllers/auth.controllers";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);

authRouter.get("/me", authenticate, getMeHandler);

export default authRouter;
