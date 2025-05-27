"use strict";
// import { Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import { v4 as uuidv4 } from "uuid";
// import Organizer from "../../../models/organizer.model";
// import ApiResponse from "../../../utils/apiResponse";
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
exports.organizerRegisterController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const uuid_1 = require("uuid");
const organizer_model_1 = __importDefault(require("../../../models/organizer.model"));
const apiResponse_1 = __importDefault(require("../../../utils/apiResponse"));
const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: "None",
};
const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "None",
};
exports.organizerRegisterController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { organizer_name, userName, contact_number, email, password, locality, city, state, } = req.body;
    if ([
        organizer_name,
        userName,
        contact_number,
        email,
        password,
        locality,
        city,
        state,
    ].some((field) => typeof field !== "string" || field.trim() === "")) {
        throw (0, http_errors_1.default)(400, "All fields are required");
    }
    const existingOrganizer = yield organizer_model_1.default.findOne({
        $or: [{ email }, { contact_number }, { userName }],
    });
    if (existingOrganizer) {
        throw (0, http_errors_1.default)(409, "Organizer with this email or contact number already exits.");
    }
    const file = req.file;
    const fileLocation = (_a = file === null || file === void 0 ? void 0 : file.location) !== null && _a !== void 0 ? _a : null;
    const uuid = (0, uuid_1.v4)();
    const newOrganizer = new organizer_model_1.default({
        _id: uuid,
        organizer_name,
        userName,
        contact_number,
        email,
        password,
        locality,
        city,
        state,
        created_projects: [],
        logo: fileLocation,
    });
    const refreshToken = newOrganizer.generateRefreshToken("organizer");
    newOrganizer.refreshToken = refreshToken;
    yield newOrganizer.save();
    const accessToken = newOrganizer.generateAccessToken("organizer");
    const response = new apiResponse_1.default(201, {
        organizer: newOrganizer,
    }, "Organizer registered and logged in successfully");
    res.status(201)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(response);
}));
