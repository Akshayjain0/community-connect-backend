import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
	createProject,
	expressInterest,
	getInterestedVolunteers,
	getMyInterestedProjects,
} from "../controllers/project";

const projectRouter = Router();

projectRouter.post("/", auth, createProject);

// POST /projects/:id/interest — volunteer expresses interest
projectRouter.post("/:id/interest", auth, expressInterest);

// GET /projects/:id/interested-volunteers — organizer views interested users
projectRouter.get("/:id/interested-volunteers", auth, getInterestedVolunteers);

// GET /volunteers/me/interested-projects — volunteer views their interested projects
projectRouter.get(
	"/volunteers/me/interested",
	auth,
	getMyInterestedProjects
);

export default projectRouter;
