import { Request, Response, Router } from "express";

import { logoUpload, profileUpload } from "../middlewares";

import {
	organizerLoginController,
	organizerRegisterController,
} from "../controllers/auth/organizer";
import {
	volunteerLoginController,
	volunteerRegisterController,
} from "../controllers/auth";
import { auth } from "../middlewares/auth.middleware";
import { logOutUser } from "../controllers/auth/logoutUser.controller";

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

// Me Route
authRouter.get("/me", auth, async (req: Request, res: Response) => {
	res.status(200).json({
		user: req.user,
		role: req.role,
	});
});

// 👋🏻 Protected Routes
authRouter.post("/logout", auth, logOutUser);

export default authRouter;
