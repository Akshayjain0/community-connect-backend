import { Router } from "express";

import { logoUpload, profileUpload } from "../middlewares";

import {
	organizerLoginController,
	organizerRegisterController,
} from "../controllers/auth/organizer";
import {
	volunteerLoginController,
	volunteerRegisterController,
} from "../controllers/auth";

const authRouter = Router();

// 👋🏻 Volunteer API Routes
authRouter.post(
	"/volunteerRegister",
	profileUpload.single("profileImages"),
	volunteerRegisterController
);
authRouter.post("/volunteerLogin", volunteerLoginController);

// 👋🏻 Organizer API Routes
authRouter.post(
	"/organizerRegister",
	logoUpload.single("logo"),
	organizerRegisterController
);
authRouter.post("/organizerLogin", organizerLoginController);

export default authRouter;
