// controllers/projectController.ts
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";

import createError from "http-errors";
import Project from "../../models/project.model";

const CreateProjectSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters"),
	state: z.string().min(2, "State is required"),
	city: z.string().min(2, "City is required"),
	locality: z.string().min(2, "Locality details are required"),
	domain_id: z.string().uuid("Invalid domain_id format"),
	subdomain_ids: z
		.array(z.string().uuid("Invalid subdomain_id format"))
		.min(1, "At least one subdomain is required"),
	time_commitment: z.string().min(2, "Time commitment must be specified"),
});

export const createProject = asyncHandler(
	async (req: Request, res: Response) => {
		if (req.role !== "organizer") {
			throw createError(
				403,
				"Access denied: Only organizers can create projects."
			);
		}

		const organizerId = req.user?._id;

		let validatedData;
		try {
			validatedData = CreateProjectSchema.parse(req.body);
		} catch (err) {
			if (err instanceof z.ZodError) {
				throw createError(
					400,
					JSON.stringify(
						err.errors.map((e) => ({
							field: e.path.join("."),
							message: e.message,
						}))
					)
				);
			}
			throw err;
		}

		const project = await Project.create({
			...validatedData,
			organizer_id: organizerId,
			interested_volunteers: [],
		});

		res.status(201).json(project);
	}
);
