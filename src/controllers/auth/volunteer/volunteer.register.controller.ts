import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";

import { v4 as uuidv4 } from "uuid";
import Volunteer from "../../../models/volunteer.model";
import ApiResponse from "../../../utils/apiResponse";
interface MulterS3File extends Express.Multer.File {
	location: string; // AWS S3 returns this field
}

export const volunteerRegisterController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { fullName, userName, email, password, location } = req.body;
		if (
			[fullName, userName, email, password, location].some(
				(field) => typeof field !== "string" || field.trim() === ""
			)
		) {
			throw createError(400, "All fields are required");
		}

		const existingVolunteer = await Volunteer.findOne({
			$or: [{ email }, { userName }],
		});
		if (existingVolunteer) {
			throw createError(409, "Volunteer with this email or userName already exits.");
		}
		if (!req.file) {
			throw createError(400, "No profile image uploaded.");
		}
		const file = req.file as MulterS3File;
		const uuid = uuidv4();
		console.log("Its runs", uuid);
		const newVolunteer = new Volunteer({
			_id: uuid,
			fullName,
			email,
			userName,
			password,
			location,
			interested_domains: [],
			volunteer_status: "Active",
			willing_to_work_in_other_domains: true,
			availability: "Flexible",
			joined_projects: [],
			profile_picture: file.location,
		});
		const refreshToken: string =
			newVolunteer.generateRefreshToken("volunteer");
		newVolunteer.refreshToken = refreshToken; // Store refresh token in DB

		await newVolunteer.save(); // ✅ Now refreshToken is saved

		// ✅ Generate the access token
		const accessToken: string =
			newVolunteer.generateAccessToken("volunteer");

		const response = new ApiResponse(
			200,
			{ volunteer: newVolunteer, accessToken },
			"Volunteer Registered Successfully"
		);
		res.status(201).json(response);
	}
);
