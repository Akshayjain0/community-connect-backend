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
exports.volunteerRegisterController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const uuid_1 = require("uuid");
const volunteer_model_1 = __importDefault(require("../../../models/volunteer.model"));
const domain_model_1 = __importDefault(require("../../../models/domain.model"));
const apiResponse_1 = __importDefault(require("../../../utils/apiResponse"));
// const accessTokenOptions = {
// 	httpOnly: true,
// 	secure: process.env.NODE_ENV === "production",
// 	maxAge: 15 * 60 * 1000, // 15 minutes
// 	sameSite: "None" as unknown as boolean,
// };
// const refreshTokenOptions = {
// 	httpOnly: true,
// 	secure: process.env.NODE_ENV === "production",
// 	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// 	sameSite: "None" as unknown as boolean,
// };
const accessTokenOptions = {
    httpOnly: true,
    secure: false, // 👈 allow cookies over HTTP
    sameSite: "lax", // 👈 allow cookies on same-site GET
    maxAge: 15 * 60 * 1000, // 15 minutes
};
const refreshTokenOptions = {
    httpOnly: true,
    secure: false, // 👈 allow cookies over HTTP
    sameSite: "lax", // 👈 allow cookies on same-site GET
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
exports.volunteerRegisterController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { fullName, userName, email, password, locality, city, state } = req.body;
    let interestedDomainsParsed;
    try {
        interestedDomainsParsed =
            typeof req.body.interested_domains === "string"
                ? JSON.parse(req.body.interested_domains)
                : req.body.interested_domains;
    }
    catch (err) {
        throw (0, http_errors_1.default)(400, err || "Invalid JSON in interested_domains");
    }
    if ([fullName, userName, email, password, locality, city, state].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw (0, http_errors_1.default)(400, "All fields are required");
    }
    const existingVolunteer = yield volunteer_model_1.default.findOne({
        $or: [{ email }, { userName }],
    });
    if (existingVolunteer) {
        throw (0, http_errors_1.default)(409, "Volunteer with this email or userName already exists.");
    }
    const file = req.file;
    const fileLocation = (_a = file === null || file === void 0 ? void 0 : file.location) !== null && _a !== void 0 ? _a : null;
    const uuid = (0, uuid_1.v4)();
    const validatedDomains = [];
    if (!Array.isArray(interestedDomainsParsed)) {
        throw (0, http_errors_1.default)(400, "interested_domains must be an array");
    }
    for (const entry of interestedDomainsParsed) {
        const { domain_id, subdomain_ids } = entry;
        if (typeof domain_id !== "string" ||
            !Array.isArray(subdomain_ids)) {
            throw (0, http_errors_1.default)(400, "Invalid interested_domains structure");
        }
        const domainDoc = yield domain_model_1.default.findById(domain_id);
        if (!domainDoc) {
            throw (0, http_errors_1.default)(404, `Domain not found: ${domain_id}`);
        }
        const domainSubIds = domainDoc.subdomains.map((s) => s._id);
        const validSubs = subdomain_ids.every((sid) => domainSubIds.includes(sid));
        if (!validSubs) {
            throw (0, http_errors_1.default)(400, `Invalid subdomain(s) for domain: ${domain_id}`);
        }
        validatedDomains.push({ domain_id, subdomain_ids });
    }
    // Create the volunteer document
    const newVolunteer = new volunteer_model_1.default({
        _id: uuid,
        fullName,
        email,
        userName,
        password,
        locality,
        city,
        state,
        interested_domains: validatedDomains,
        interested_projects: [],
        volunteer_status: "Active",
        willing_to_work_in_other_domains: true,
        availability: "Flexible",
        joined_projects: [],
        profile_picture: fileLocation,
    });
    // ✅ Generate Tokens
    const accessToken = newVolunteer.generateAccessToken("volunteer");
    const refreshToken = newVolunteer.generateRefreshToken("volunteer");
    newVolunteer.refreshToken = refreshToken;
    yield newVolunteer.save();
    const response = new apiResponse_1.default(201, { volunteer: newVolunteer }, "Volunteer registered and logged in successfully");
    // ✅ Set tokens in cookies
    res.status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(response);
}));
