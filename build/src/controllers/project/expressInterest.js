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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyInterestedProjects = exports.getInterestedVolunteers = exports.expressInterest = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const volunteer_model_1 = __importDefault(require("../../models/volunteer.model"));
exports.expressInterest = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.role !== "volunteer") {
        throw (0, http_errors_1.default)(403, "Only volunteers can express interest.");
    }
    const volunteerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!volunteerId)
        throw (0, http_errors_1.default)(401, "Unauthorized: Missing user ID");
    const projectId = req.params.id;
    if (!projectId)
        throw (0, http_errors_1.default)(400, "Missing project ID");
    const project = yield project_model_1.default.findById(projectId);
    if (!project)
        throw (0, http_errors_1.default)(404, "Project not found.");
    if (!project.interested_volunteers.includes(volunteerId)) {
        project.interested_volunteers.push(volunteerId);
        yield project.save();
    }
    const volunteer = yield volunteer_model_1.default.findById(volunteerId);
    if (volunteer && !volunteer.interested_projects.includes(projectId)) {
        volunteer.interested_projects.push(projectId);
        yield volunteer.save();
    }
    res.status(200).json({ message: "Interest expressed successfully." });
}));
exports.getInterestedVolunteers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.role !== "organizer") {
        throw (0, http_errors_1.default)(403, "Access denied: Only organizers can view interested volunteers.");
    }
    const projectId = req.params.id;
    const project = yield project_model_1.default.findById(projectId).populate("interested_volunteers", "_id fullName email");
    if (!project)
        throw (0, http_errors_1.default)(404, "Project not found");
    res.status(200).json({ volunteers: project.interested_volunteers });
}));
exports.getMyInterestedProjects = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.role !== "volunteer") {
        throw (0, http_errors_1.default)(403, "Access denied: Only volunteers can view their interested projects.");
    }
    const volunteer = yield volunteer_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).populate("interested_projects");
    if (!volunteer)
        throw (0, http_errors_1.default)(404, "Volunteer not found");
    res.status(200).json({ projects: volunteer.interested_projects });
}));
