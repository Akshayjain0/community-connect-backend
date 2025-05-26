"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const project_1 = require("../controllers/project");
const getMyProjects_1 = require("../controllers/project/getMyProjects");
const getVolunteerFeed_1 = require("../controllers/project/getVolunteerFeed");
const createProject_1 = require("../controllers/project/createProject");
const projectRouter = (0, express_1.Router)();
projectRouter.post("/", auth_middleware_1.auth, createProject_1.createProject);
// POST /projects/:id/interest — volunteer expresses interest
projectRouter.post("/:id/interest", auth_middleware_1.auth, project_1.expressInterest);
// GET /projects/:id/interested-volunteers — organizer views interested users
projectRouter.get("/:id/interested-volunteers", auth_middleware_1.auth, project_1.getInterestedVolunteers);
// GET /volunteers/me/interested-projects — volunteer views their interested projects
projectRouter.get("/volunteers/me/interested", auth_middleware_1.auth, project_1.getMyInterestedProjects);
// ✅ New routes
projectRouter.get("/my-projects", auth_middleware_1.auth, getMyProjects_1.getMyProjects);
projectRouter.get("/feed", auth_middleware_1.auth, getVolunteerFeed_1.getVolunteerFeed);
exports.default = projectRouter;
