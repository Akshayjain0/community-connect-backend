import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import Organizer from "../../../models/organizer.model";
import ApiResponse from "../../../utils/apiResponse";

const generateAccessTokenAndRefreshToken = async (
	organizerId: string,
	role: string
) => {
	try {
		const organizer = await Organizer.findById(organizerId);
		if (!organizer) {
			throw createError(404, "Organizer not found.");
		}

		const accessToken: string = organizer.generateAccessToken(role);
		const refreshToken: string = organizer.generateRefreshToken(role);

		// 🔹 Update refreshToken in the database
		organizer.refreshToken = refreshToken;
		await organizer.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		throw createError(500, `Error generating tokens: ${error}`);
	}
};

export const organizerLoginController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { email, password, userName } = req.body;

		if (!password || (!userName && !email)) {
			throw createError(
				400,
				"Either username or email and password are required."
			);
		}

		// ✅ Check organizer exists or not
		const existingOrganizer = await Organizer.findOne({
			$or: [{ email }, { userName }],
		});

		if (!existingOrganizer) {
			throw createError(404, "Invalid credentials.");
		}
		// ✅ Validate Password
		const isPasswordValid = await existingOrganizer.isPasswordCorrect(
			password
		);

		if (!isPasswordValid) {
			throw createError(401, "Invalid credentials.");
		}

		// ✅ Generate and Save Tokens
		const { accessToken, refreshToken } =
			await generateAccessTokenAndRefreshToken(
				existingOrganizer._id,
				"organizer"
			);

		// const options = {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production",
		// 	maxAge: 24 * 60 * 60 * 1000,
		// 	// sameSite: "strict" as unknown as boolean,
		// };

		const accessTokenOptions = {
			httpOnly: true,
			secure: false, // 👈 allow cookies over HTTP
			sameSite: "lax" as unknown as boolean, // 👈 allow cookies on same-site GET
			maxAge: 15 * 60 * 1000, // 15 minutes
		};

		const refreshTokenOptions = {
			httpOnly: true,
			secure: false, // 👈 allow cookies over HTTP
			sameSite: "lax" as unknown as boolean, // 👈 allow cookies on same-site GET
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		};

		const response = new ApiResponse(200, {
			data: existingOrganizer,
			accessToken,
			refreshToken,
		});

		res.status(200)
			.cookie("accessToken", accessToken, accessTokenOptions)
			.cookie("refreshToken", refreshToken, refreshTokenOptions)
			.json(response);
	}
);
