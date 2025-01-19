import { Request, Response } from "express";

export const getAllUser = (req: Request, res: Response) => {
	res.send("Get all users");
};
