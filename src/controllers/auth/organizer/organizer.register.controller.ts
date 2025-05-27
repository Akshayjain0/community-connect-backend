// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import { v4 as uuidv4 } from "uuid";
// import Organizer from "../../../models/organizer.model";
// import ApiResponse from "../../../utils/apiResponse";

// interface MulterS3File extends Express.Multer.File {
// 	location: string; // AWS S3 returns this field
// }

// export const organizerRegisterController = asyncHandler(
// 	async (req: Request, res: Response): Promise<void> => {
// 		const {
// 			organizer_name,
// 			userName,
// 			contact_number,
// 			email,
// 			password,
// 			locality,
// 			city,
// 			state,
// 		} = req.body;

// 		// Check all fields
// 		if (
// 			[
// 				organizer_name,
// 				userName,
// 				contact_number,
// 				email,
// 				password,
// 				locality,
// 				city,
// 				state,
// 			].some((field) => typeof field !== "string" || field.trim() === "")
// 		) {
// 			throw createError(400, "All fields are required");
// 		}

// 		// Check organizer exists or not
// 		const existingOrganizer = await Organizer.findOne({
// 			$or: [{ email }, { contact_number }, { userName }],
// 		});

// 		if (existingOrganizer) {
// 			throw createError(
// 				409,
// 				"Organizer with this email or contact number already exits."
// 			);
// 		}

// 		// Check file for logo
// 		// if (!req.file) {
// 		// 	throw createError(400, "No logo image uploaded");
// 		// }

// 		const file = req.file as MulterS3File | undefined;
// 		const fileLocation = file?.location ?? null;
// 		const uuid = uuidv4();
// 		console.log("Its runs", uuid);
// 		const newOrganizer = new Organizer({
// 			_id: uuid,
// 			organizer_name,
// 			userName,
// 			contact_number,
// 			email,
// 			password,
// 			locality,
// 			city,
// 			state,
// 			created_projects: [],
// 			logo: fileLocation,
// 		});
// 		const refreshToken: string =
// 			newOrganizer.generateRefreshToken("organizer");
// 		newOrganizer.refreshToken = refreshToken;

// 		await newOrganizer.save();

// 		const accessToken: string =
// 			newOrganizer.generateAccessToken("organizer");

// 		const response = new ApiResponse(
// 			200,
// 			{
// 				organizer: newOrganizer,
// 				accessToken,
// 			},
// 			"Organizer Registered Successfully"
// 		);
// 		res.status(201).json(response);
// 	}
// );

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import Organizer from "../../../models/organizer.model";
import ApiResponse from "../../../utils/apiResponse";

interface MulterS3File extends Express.Multer.File {
	location: string; // AWS S3 returns this field
}

const accessTokenOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 15 * 60 * 1000, // 15 minutes
	sameSite: "None" as unknown as boolean,
};

const refreshTokenOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	sameSite: "None" as unknown as boolean,
};

export const organizerRegisterController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const {
			organizer_name,
			userName,
			contact_number,
			email,
			password,
			locality,
			city,
			state,
		} = req.body;

		if (
			[
				organizer_name,
				userName,
				contact_number,
				email,
				password,
				locality,
				city,
				state,
			].some((field) => typeof field !== "string" || field.trim() === "")
		) {
			throw createError(400, "All fields are required");
		}

		const existingOrganizer = await Organizer.findOne({
			$or: [{ email }, { contact_number }, { userName }],
		});

		if (existingOrganizer) {
			throw createError(
				409,
				"Organizer with this email or contact number already exits."
			);
		}

		const file = req.file as MulterS3File | undefined;
		const fileLocation = file?.location ?? null;
		const uuid = uuidv4();

		const newOrganizer = new Organizer({
			_id: uuid,
			organizer_name,
			userName,
			contact_number,
			email,
			password,
			locality,
			city,
			state,
			created_projects: [],
			logo: fileLocation,
		});

		const refreshToken: string =
			newOrganizer.generateRefreshToken("organizer");
		newOrganizer.refreshToken = refreshToken;
		await newOrganizer.save();

		const accessToken: string =
			newOrganizer.generateAccessToken("organizer");

		const response = new ApiResponse(
			201,
			{
				organizer: newOrganizer,
			},
			"Organizer registered and logged in successfully"
		);

		res.status(201)
			.cookie("accessToken", accessToken, accessTokenOptions)
			.cookie("refreshToken", refreshToken, refreshTokenOptions)
			.json(response);
	}
);
