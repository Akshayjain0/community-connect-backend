import { Request, Response } from "express";
import Volunteer from "../../models/volunteer.model";
import Project from "../../models/project.model";
import asyncHandler from "express-async-handler";
import createError from "http-errors";

export const getVolunteerFeed = asyncHandler(
	async (req: Request, res: Response) => {
		if (req.role !== "volunteer") {
			throw createError(403, "Only volunteers can access the feed");
		}

		const volunteer = await Volunteer.findById(req.user?._id);
		if (!volunteer) throw createError(404, "Volunteer not found");

		let projects;
		if (volunteer.willing_to_work_in_other_domains) {
			projects = await Project.find({})
				.sort({ created_at: -1 })
				.populate("organizer_id", "organizer_name") // ✅ populate name
				.exec();
		} else {
			const domainFilters = volunteer.interested_domains.map((d) => ({
				domain_id: d.domain_id,
				subdomain_ids: { $in: d.subdomain_ids },
			}));

			projects = await Project.find({ $or: domainFilters })
				.sort({ created_at: -1 })
				.populate("organizer_id", "organizer_name") // ✅ populate name
				.exec();
		}

		res.status(200).json({ projects });
	}
);
