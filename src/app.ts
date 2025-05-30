import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRouter from "./routes/routes";
import createHttpError from "http-errors";
import { errorHandler } from "./middlewares";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();
const app: Application = express();

app.use(express.json({ limit: "16kb" }));
app.use(
	cors({
		origin: "http://13.202.85.79:8021", // must be exact
		credentials: true, // allow cookies, auth headers
	})
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/v1", mainRouter);

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, Typescript with express js.");
});

app.use((req: Request, res: Response, next: NextFunction) => {
	next(createHttpError(404, "Resource not found"));
});

// Error-handling middleware
app.use(errorHandler);

export default app;
