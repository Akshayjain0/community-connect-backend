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
exports.volunteerLoginController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const volunteer_model_1 = __importDefault(require("../../../models/volunteer.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const apiResponse_1 = __importDefault(require("../../../utils/apiResponse"));
const generateAccessTokenAndRefreshToken = (volunteerId, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const volunteer = yield volunteer_model_1.default.findById(volunteerId);
        if (!volunteer) {
            throw (0, http_errors_1.default)(404, "Volunteer not found.");
        }
        const accessToken = volunteer.generateAccessToken(role);
        const refreshToken = volunteer.generateRefreshToken(role);
        // 🔹 Update refreshToken in the database
        volunteer.refreshToken = refreshToken;
        yield volunteer.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw (0, http_errors_1.default)(500, `Error generating tokens: ${error}`);
    }
});
exports.volunteerLoginController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, userName } = req.body;
    if (!password || (!userName && !email)) {
        throw (0, http_errors_1.default)(400, "Either username or email and password are required.");
    }
    // ✅ Check volunteer exists or not
    const existingVolunteer = yield volunteer_model_1.default.findOne({
        $or: [{ email }, { userName }],
    });
    if (!existingVolunteer) {
        throw (0, http_errors_1.default)(404, "Invalid credentials.");
    }
    // ✅ Validate Password
    const isPasswordValid = yield existingVolunteer.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw (0, http_errors_1.default)(401, "Invalid credentials password.");
    }
    // ✅ Generate and Save Tokens
    const { accessToken, refreshToken } = yield generateAccessTokenAndRefreshToken(existingVolunteer._id, "volunteer");
    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 minutes for Access Token
        sameSite: "Strict",
    };
    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for Refresh Token
        sameSite: "Strict",
    };
    const response = new apiResponse_1.default(200, {
        data: existingVolunteer,
        accessToken,
        refreshToken,
    });
    res.status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(response);
}));
