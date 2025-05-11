import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import { v4 as uuidv4 } from "uuid";
import Volunteer from "../../../models/volunteer.model";
import Domain from "../../../models/domain.model";
import ApiResponse from "../../../utils/apiResponse";

interface MulterS3File extends Express.Multer.File {
	location: string;
}

const accessTokenOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 15 * 60 * 1000, // 15 minutes
	sameSite: "Strict" as unknown as boolean,
};

const refreshTokenOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	sameSite: "Strict" as unknown as boolean,
};

export const volunteerRegisterController = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { fullName, userName, email, password, locality, city, state } =
			req.body;

		let interestedDomainsParsed;
		try {
			interestedDomainsParsed =
				typeof req.body.interested_domains === "string"
					? JSON.parse(req.body.interested_domains)
					: req.body.interested_domains;
		} catch (err) {
			throw createError(400, err || "Invalid JSON in interested_domains");
		}

		if (
			[fullName, userName, email, password, locality, city, state].some(
				(field) => typeof field !== "string" || field.trim() === ""
			)
		) {
			throw createError(400, "All fields are required");
		}

		const existingVolunteer = await Volunteer.findOne({
			$or: [{ email }, { userName }],
		});
		if (existingVolunteer) {
			throw createError(
				409,
				"Volunteer with this email or userName already exists."
			);
		}

		const file = req.file as MulterS3File | undefined;
		const fileLocation = file?.location ?? null;
		const uuid = uuidv4();

		const validatedDomains = [];

		if (!Array.isArray(interestedDomainsParsed)) {
			throw createError(400, "interested_domains must be an array");
		}

		for (const entry of interestedDomainsParsed) {
			const { domain_id, subdomain_ids } = entry;
			if (
				typeof domain_id !== "string" ||
				!Array.isArray(subdomain_ids)
			) {
				throw createError(400, "Invalid interested_domains structure");
			}

			const domainDoc = await Domain.findById(domain_id);
			if (!domainDoc) {
				throw createError(404, `Domain not found: ${domain_id}`);
			}

			const domainSubIds = domainDoc.subdomains.map((s) => s._id);
			const validSubs = subdomain_ids.every((sid) =>
				domainSubIds.includes(sid)
			);

			if (!validSubs) {
				throw createError(
					400,
					`Invalid subdomain(s) for domain: ${domain_id}`
				);
			}

			validatedDomains.push({ domain_id, subdomain_ids });
		}

		// Create the volunteer document
		const newVolunteer = new Volunteer({
			_id: uuid,
			fullName,
			email,
			userName,
			password,
			locality,
			city,
			state,
			interested_domains: validatedDomains,
			interested_projects: [],
			volunteer_status: "Active",
			willing_to_work_in_other_domains: true,
			availability: "Flexible",
			joined_projects: [],
			profile_picture: fileLocation,
		});

		// ✅ Generate Tokens
		const accessToken = newVolunteer.generateAccessToken("volunteer");
		const refreshToken = newVolunteer.generateRefreshToken("volunteer");

		newVolunteer.refreshToken = refreshToken;
		await newVolunteer.save();

		const response = new ApiResponse(
			201,
			{ volunteer: newVolunteer },
			"Volunteer registered and logged in successfully"
		);

		// ✅ Set tokens in cookies
		res.status(201)
			.cookie("accessToken", accessToken, accessTokenOptions)
			.cookie("refreshToken", refreshToken, refreshTokenOptions)
			.json(response);
	}
);
