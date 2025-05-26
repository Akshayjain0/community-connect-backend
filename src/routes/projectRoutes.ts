import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
	
	expressInterest,
	getInterestedVolunteers,
	getMyInterestedProjects,
} from "../controllers/project";
import { getMyProjects } from "../controllers/project/getMyProjects";
import { getVolunteerFeed } from "../controllers/project/getVolunteerFeed";
import { createProject } from "../controllers/project/createProject";

const projectRouter = Router();

projectRouter.post("/", auth, createProject);

// POST /projects/:id/interest — volunteer expresses interest
projectRouter.post("/:id/interest", auth, expressInterest);

// GET /projects/:id/interested-volunteers — organizer views interested users
projectRouter.get("/:id/interested-volunteers", auth, getInterestedVolunteers);

// GET /volunteers/me/interested-projects — volunteer views their interested projects
projectRouter.get("/volunteers/me/interested", auth, getMyInterestedProjects);

// ✅ New routes
projectRouter.get("/my-projects", auth, getMyProjects);
projectRouter.get("/feed", auth, getVolunteerFeed);

export default projectRouter;
