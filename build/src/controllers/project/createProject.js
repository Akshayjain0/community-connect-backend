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
exports.createProject = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const zod_1 = require("zod");
const http_errors_1 = __importDefault(require("http-errors"));
const project_model_1 = __importDefault(require("../../models/project.model"));
const CreateProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    description: zod_1.z
        .string()
        .min(10, "Description must be at least 10 characters"),
    state: zod_1.z.string().min(2, "State is required"),
    city: zod_1.z.string().min(2, "City is required"),
    locality: zod_1.z.string().min(2, "Locality details are required"),
    domain_id: zod_1.z.string().uuid("Invalid domain_id format"),
    subdomain_ids: zod_1.z
        .array(zod_1.z.string().uuid("Invalid subdomain_id format"))
        .min(1, "At least one subdomain is required"),
    time_commitment: zod_1.z.string().min(2, "Time commitment must be specified"),
});
exports.createProject = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.role !== "organizer") {
        throw (0, http_errors_1.default)(403, "Access denied: Only organizers can create projects.");
    }
    const organizerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    let validatedData;
    try {
        validatedData = CreateProjectSchema.parse(req.body);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
            throw (0, http_errors_1.default)(400, JSON.stringify(err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }))));
        }
        throw err;
    }
    const project = yield project_model_1.default.create(Object.assign(Object.assign({}, validatedData), { organizer_id: organizerId, interested_volunteers: [] }));
    res.status(201).json(project);
}));
