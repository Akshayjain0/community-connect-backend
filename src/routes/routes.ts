import authRouter from "./authRoutes";
import userRouter from "./userRoute";
import { Router } from "express";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/auth", authRouter);

export default mainRouter;
