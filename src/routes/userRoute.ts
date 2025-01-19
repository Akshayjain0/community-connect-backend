import { Router } from "express";
import { getAllUser } from "../controllers/user/userController";

const userRouter = Router();

userRouter.get("/getAll", getAllUser);

export default userRouter;
