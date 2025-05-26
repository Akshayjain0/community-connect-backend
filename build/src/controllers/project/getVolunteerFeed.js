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
exports.getVolunteerFeed = void 0;
const volunteer_model_1 = __importDefault(require("../../models/volunteer.model"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
exports.getVolunteerFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.role !== "volunteer") {
        throw (0, http_errors_1.default)(403, "Only volunteers can access the feed");
    }
    const volunteer = yield volunteer_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (!volunteer)
        throw (0, http_errors_1.default)(404, "Volunteer not found");
    let projects;
    if (volunteer.willing_to_work_in_other_domains) {
        projects = yield project_model_1.default.find({})
            .sort({ created_at: -1 })
            .populate("organizer_id", "organizer_name") // ✅ populate name
            .exec();
    }
    else {
        const domainFilters = volunteer.interested_domains.map((d) => ({
            domain_id: d.domain_id,
            subdomain_ids: { $in: d.subdomain_ids },
        }));
        projects = yield project_model_1.default.find({ $or: domainFilters })
            .sort({ created_at: -1 })
            .populate("organizer_id", "organizer_name") // ✅ populate name
            .exec();
    }
    res.status(200).json({ projects });
}));
