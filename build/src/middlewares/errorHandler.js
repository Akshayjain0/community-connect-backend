"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const errorHandler = (err, req, res, next) => {
    // Extract status code and message
    const statusCode = err.status || 500; // Default to 500 for unexpected errors
    const message = err.message || "Internal Server Error";
    // Capture stack trace in development mode
    const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;
    // Create a consistent JSON response using ApiResponse
    const response = new apiResponse_1.default(statusCode, null, // No data for errors
    message, stack // Automatically include stack if in development
    );
    // Log the stack trace to the server console for debugging
    if (statusCode >= 500) {
        console.error(err.stack);
    }
    // Return the JSON response
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
