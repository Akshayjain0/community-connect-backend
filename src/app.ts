import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello, Typescript with express js.");
});




export default app;
