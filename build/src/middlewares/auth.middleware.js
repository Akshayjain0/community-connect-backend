"use strict";
// import { NextFunction, Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import jwt from "jsonwebtoken";
// import Volunteer from "../models/volunteer.model";
// import Organizer from "../models/organizer.model";
// import { TokenPayload } from "../types/auth.types";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.auth = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const volunteer_model_1 = __importDefault(require("../models/volunteer.model"));
const organizer_model_1 = __importDefault(require("../models/organizer.model"));
exports.auth = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log("🔍 Checking cookies and headers for access token...");
    const accessToken = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
        ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
    const refreshToken = (_c = req.cookies) === null || _c === void 0 ? void 0 : _c.refreshToken;
    console.log("🔑 Access Token:", accessToken);
    console.log("🔑 Refresh Token:", refreshToken);
    const attachUserAndContinue = (decoded) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("🔍 Fetching user with ID:", decoded._id);
        const user = yield getUser(decoded);
        if (!user) {
            console.error("❌ User not found in DB");
            throw (0, http_errors_1.default)(404, "User not found");
        }
        console.log("✅ Access granted for:", decoded.email || decoded._id);
        req.user = user;
        req.role = decoded.role;
        return next();
    });
    console.log("🛡️ Verifying access token...");
    console.log("ENV TOKEN_SECRET:", process.env.TOKEN_SECRET);
    try {
        if (!accessToken) {
            throw new jsonwebtoken_1.TokenExpiredError("No access token", new Date());
        }
        else {
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET);
            console.log("✅ Access token valid for:", decoded.email || decoded._id);
            return yield attachUserAndContinue(decoded);
        }
    }
    catch (err) {
        console.warn("⚠️ Access token verification failed:", err);
        if (!(err instanceof jsonwebtoken_1.TokenExpiredError)) {
            console.warn("❌ Invalid access token - not expired");
            return next((0, http_errors_1.default)(401, "Invalid token"));
        }
        try {
            console.log("🔁 Attempting to verify refresh token...");
            if (!refreshToken) {
                console.warn("❌ No refresh token available");
                throw (0, http_errors_1.default)(401, "No refresh token available");
            }
            const decodedRefresh = jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET);
            console.log("✅ Refresh token verified for:", decodedRefresh.email);
            const user = yield getUser(decodedRefresh);
            if (!user) {
                console.error("❌ User not found for refresh token");
                throw (0, http_errors_1.default)(401, "User not found for refresh token");
            }
            const newAccessToken = jsonwebtoken_1.default.sign({
                _id: user._id,
                role: decodedRefresh.role,
                email: user.email,
            }, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" });
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false, // 👈 allow cookies over HTTP
                sameSite: "lax", // 👈 allow cookies on same-site GET
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            console.log("🔁 New access token issued for:", user.email);
            req.user = user;
            req.role = decodedRefresh.role;
            return next();
        }
        catch (refreshErr) {
            console.error("❌ Refresh token verification failed:", refreshErr);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return next((0, http_errors_1.default)(403, "Invalid or expired refresh token"));
        }
    }
}));
const getUser = (decoded) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔎 getUser() role:", decoded.role, "ID:", decoded._id);
    if (decoded.role === "volunteer") {
        return yield volunteer_model_1.default.findById(decoded._id).select("-password");
    }
    else if (decoded.role === "organizer") {
        return yield organizer_model_1.default.findById(decoded._id).select("-password");
    }
    return null;
});
