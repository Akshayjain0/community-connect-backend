"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("./authRoutes"));
const domainRoutes_1 = __importDefault(require("./domainRoutes"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const userRoute_1 = __importDefault(require("./userRoute"));
const express_1 = require("express");
const mainRouter = (0, express_1.Router)();
mainRouter.use("/users", userRoute_1.default);
mainRouter.use("/auth", authRoutes_1.default);
mainRouter.use("/projects", projectRoutes_1.default);
mainRouter.use("/domains", domainRoutes_1.default);
exports.default = mainRouter;
