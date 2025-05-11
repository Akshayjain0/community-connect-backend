import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import createError from "http-errors";
import Project from "../../models/project.model";
import Volunteer from "../../models/volunteer.model";

export const expressInterest = asyncHandler(
	async (req: Request, res: Response) => {
		if (req.role !== "volunteer") {
			throw createError(403, "Only volunteers can express interest.");
		}

		const volunteerId = req.user?._id;
		if (!volunteerId)
			throw createError(401, "Unauthorized: Missing user ID");

		const projectId = req.params.id;
		if (!projectId) throw createError(400, "Missing project ID");

		const project = await Project.findById(projectId);
		if (!project) throw createError(404, "Project not found.");

		if (!project.interested_volunteers.includes(volunteerId)) {
			project.interested_volunteers.push(volunteerId);
			await project.save();
		}

		const volunteer = await Volunteer.findById(volunteerId);
		if (volunteer && !volunteer.interested_projects.includes(projectId)) {
			volunteer.interested_projects.push(projectId);
			await volunteer.save();
		}

		res.status(200).json({ message: "Interest expressed successfully." });
	}
);

export const getInterestedVolunteers = asyncHandler(
	async (req: Request, res: Response) => {
		if (req.role !== "organizer") {
			throw createError(
				403,
				"Access denied: Only organizers can view interested volunteers."
			);
		}

		const projectId = req.params.id;
		const project = await Project.findById(projectId).populate(
			"interested_volunteers",
			"_id fullName email"
		);

		if (!project) throw createError(404, "Project not found");

		res.status(200).json({ volunteers: project.interested_volunteers });
	}
);

export const getMyInterestedProjects = asyncHandler(
	async (req: Request, res: Response) => {
		if (req.role !== "volunteer") {
			throw createError(
				403,
				"Access denied: Only volunteers can view their interested projects."
			);
		}

		const volunteer = await Volunteer.findById(req.user?._id).populate(
			"interested_projects"
		);

		if (!volunteer) throw createError(404, "Volunteer not found");

		res.status(200).json({ projects: volunteer.interested_projects });
	}
);
