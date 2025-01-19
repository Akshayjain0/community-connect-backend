import userRouter from "./userRoute";
import { Router } from "express";

const mainRouter = Router();

mainRouter.use("/users", userRouter);

export default mainRouter;
