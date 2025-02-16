import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Volunteer from "../../../models/volunteer.model";
import createError from "http-errors";
import ApiResponse from "../../../utils/apiResponse";

const generateAccessTokenAndRefreshToken = async (
	volunteerId: string,
	role: string
) => {
	try {
		const volunteer = await Volunteer.findById(volunteerId);
		if (!volunteer) {
			throw createError(404, "Volunteer not found.");
		}

		const accessToken: string = volunteer.generateAccessToken(role);
		const refreshToken: string = volunteer.generateRefreshToken(role);

		// 🔹 Update refreshToken in the database
		volunteer.refreshToken = refreshToken;
		await volunteer.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw createError(500, `Error generating tokens: ${error}`);
	}
};

export const volunteerLoginController = asyncHandler(
	async (req: Request, res: Response) => {
		const { email, password, userName } = req.body;

		if (!password || (!userName && !email)) {
			throw createError(
				400,
				"Either username or email and password are required."
			);
		}

		// ✅ Check volunteer exists or not
		const existingVolunteer = await Volunteer.findOne({
			$or: [{ email }, { userName }],
		});

		if (!existingVolunteer) {
			throw createError(404, "Invalid credentials.");
		}
		// ✅ Validate Password
		const isPasswordValid = await existingVolunteer.isPasswordCorrect(
			password
		);

		if (!isPasswordValid) {
			throw createError(401, "Invalid credentials password.");
		}

		// ✅ Generate and Save Tokens
		const { accessToken, refreshToken } =
			await generateAccessTokenAndRefreshToken(
				existingVolunteer._id,
				"volunteer"
			);

		const accessTokenOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 15 * 60 * 1000, // 15 minutes for Access Token
			sameSite: "Strict" as unknown as boolean,
		};

		const refreshTokenOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for Refresh Token
			sameSite: "Strict" as unknown as boolean,
		};

		const response = new ApiResponse(200, {
			data: existingVolunteer,
			accessToken,
			refreshToken,
		});

		res.status(200)
			.cookie("accessToken", accessToken, accessTokenOptions)
			.cookie("refreshToken", refreshToken, refreshTokenOptions)
			.json(response);
	}
);
