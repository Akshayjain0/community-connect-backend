import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import Volunteer from "../models/volunteer.model";
import Organizer from "../models/organizer.model";
import { TokenPayload } from "../types/auth.types";

export const auth = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			// 🔹 Retrieve token from cookies or authorization header
			const token =
				req.cookies?.accessToken ||
				req.header("Authorization")?.replace("Bearer ", "");

			if (!token) {
				return next(
					createError(401, "Unauthorized request: No token provided.")
				);
			}

			// 🔹 Verify JWT
			const decodedToken = jwt.verify(
				token,
				process.env.TOKEN_SECRET as string
			) as TokenPayload;

			let user;
			if (decodedToken.role === "volunteer") {
				user = await Volunteer.findById(decodedToken._id).select(
					"-password"
				);
			} else if (decodedToken.role === "organizer") {
				user = await Organizer.findById(decodedToken._id).select(
					"-password"
				);
			}

			if (!user) {
				return next(createError(404, "User not found."));
			}

			// 🔹 Attach user and role to request
			req.user = user;
			req.role = decodedToken.role;

			next();
		} catch (error: unknown) {
			return next(createError(401, `${error}---->from auth middleware`));
		}
	}
);
