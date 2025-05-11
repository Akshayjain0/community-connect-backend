import authRouter from "./authRoutes";
import domainRouter from "./domainRoutes";
import projectRouter from "./projectRoutes";
import userRouter from "./userRoute";
import { Router } from "express";

const mainRouter = Router();

mainRouter.use("/users", userRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/projects", projectRouter);
mainRouter.use("/domains", domainRouter);

export default mainRouter;
