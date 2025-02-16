import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import Organizer from "../../../models/organizer.model";
import ApiResponse from "../../../utils/apiResponse";

interface MulterS3File extends Express.Multer.File {
	location: string; // AWS S3 returns this field
}

export const organizerRegisterController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const {
			organizer_name,
			userName,
			contact_number,
			email,
			password,
			location,
		} = req.body;

		// Check all fields
		if (
			[
				organizer_name,
				userName,
				contact_number,
				email,
				password,
				location,
			].some((field) => typeof field !== "string" || field.trim() === "")
		) {
			throw createError(400, "All fields are required");
		}

		// Check organizer exists or not
		const existingOrganizer = await Organizer.findOne({
			$or: [{ email }, { contact_number }, { userName }],
		});

		if (existingOrganizer) {
			throw createError(
				409,
				"Organizer with this email or contact number already exits."
			);
		}

		// Check file for logo
		if (!req.file) {
			throw createError(400, "No logo image uploaded");
		}
		const file = req.file as MulterS3File;
		const uuid = uuidv4();
		console.log("Its runs", uuid);
		const newOrganizer = new Organizer({
			_id: uuid,
			organizer_name,
			userName,
			contact_number,
			email,
			password,
			location,
			created_projects: [],
			logo: file.location,
		});
		const refreshToken: string = newOrganizer.generateRefreshToken();
		newOrganizer.refreshToken = refreshToken;

		await newOrganizer.save();

		const accessToken: string = newOrganizer.generateAccessToken();

		const response = new ApiResponse(
			200,
			{
				organizer: newOrganizer,
				accessToken,
			},
			"Organizer Registered Successfully"
		);
		res.status(201).json(response);
	}
);
