"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/user/userController");
const userRouter = (0, express_1.Router)();
userRouter.get("/getAll", userController_1.getAllUser);
exports.default = userRouter;
