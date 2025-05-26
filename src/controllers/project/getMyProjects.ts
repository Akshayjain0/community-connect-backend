import { Request, Response } from "express";
import Project from "../../models/project.model";
import asyncHandler from "express-async-handler";
import createError from "http-errors";

export const getMyProjects = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		if (req.role !== "organizer") {
			throw createError(403, "Only organizers can access their projects");
		}

		const organizerId = req.user?._id;
		const projects = await Project.find({ organizer_id: organizerId })
			.sort({ created_at: -1 })
			.exec();

		res.status(200).json({ projects }); // ✅ Don't return
	}
);
