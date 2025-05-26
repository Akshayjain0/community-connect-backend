"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const organizer_1 = require("../controllers/auth/organizer");
const auth_1 = require("../controllers/auth");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const logoutUser_controller_1 = require("../controllers/auth/logoutUser.controller");
const authRouter = (0, express_1.Router)();
// 👋🏻 Volunteer API Routes
authRouter.post("/volunteerRegister", middlewares_1.profileUpload.single("profileImages"), auth_1.volunteerRegisterController);
authRouter.post("/volunteerLogin", auth_1.volunteerLoginController);
// 👋🏻 Organizer API Routes
authRouter.post("/organizerRegister", middlewares_1.logoUpload.single("logo"), organizer_1.organizerRegisterController);
authRouter.post("/organizerLogin", organizer_1.organizerLoginController);
// Me Route
authRouter.get("/me", auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        user: req.user,
        role: req.role,
    });
}));
// 👋🏻 Protected Routes
authRouter.post("/logout", auth_middleware_1.auth, logoutUser_controller_1.logOutUser);
exports.default = authRouter;
