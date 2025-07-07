import { Router } from "express";
import {
    createUserHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    uploadAvatarHandler,
} from "../controllers/user.controllers";
import { authenticate } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", getAllUsersHandler);
userRouter.get("/:id", getUserByIdHandler);
userRouter.post("/", createUserHandler);
userRouter.post("/avatar", authenticate, uploadAvatarHandler);

export default userRouter;
