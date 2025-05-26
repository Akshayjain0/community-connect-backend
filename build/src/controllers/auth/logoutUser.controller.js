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
exports.logOutUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const volunteer_model_1 = __importDefault(require("../../models/volunteer.model"));
const organizer_model_1 = __importDefault(require("../../models/organizer.model"));
exports.logOutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, user } = req;
    if (!user || !role) {
        throw (0, http_errors_1.default)(401, "Unauthorized: No user data found.");
    }
    try {
        if (role === "volunteer") {
            yield volunteer_model_1.default.findByIdAndUpdate(user._id, { refreshToken: null });
        }
        else if (role === "organizer") {
            yield organizer_model_1.default.findByIdAndUpdate(user._id, { refreshToken: null });
        }
        else {
            throw (0, http_errors_1.default)(400, "Invalid user role.");
        }
        // 🔹 Clear cookies
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });
        res.status(200).json({
            message: "User has been logged out successfully.",
        });
    }
    catch (error) {
        throw (0, http_errors_1.default)(500, `${error}--->Server error during logout.`);
    }
}));
