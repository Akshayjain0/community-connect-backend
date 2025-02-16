import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import Volunteer from "../../models/volunteer.model";
import Organizer from "../../models/organizer.model";

export const logOutUser = asyncHandler(async (req: Request, res: Response) => {
	const { role, user } = req;

	if (!user || !role) {
		throw createError(401, "Unauthorized: No user data found.");
	}

	try {
		if (role === "volunteer") {
			await Volunteer.findByIdAndUpdate(user._id, { refreshToken: null });
		} else if (role === "organizer") {
			await Organizer.findByIdAndUpdate(user._id, { refreshToken: null });
		} else {
			throw createError(400, "Invalid user role.");
		}

		// 🔹 Clear cookies
		res.clearCookie("accessToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict" as unknown as boolean,
		});

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict" as unknown as boolean,
		});

		res.status(200).json({
			message: "User has been logged out successfully.",
		});
	} catch (error) {
		throw createError(500, `${error}--->Server error during logout.`);
	}
});
