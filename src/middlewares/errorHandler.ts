/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import ApiResponse from "../utils/apiResponse";

const errorHandler = (
	err: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Extract status code and message
	const statusCode = err.status || 500; // Default to 500 for unexpected errors
	const message = err.message || "Internal Server Error";

	// Capture stack trace in development mode
	const stack =
		process.env.NODE_ENV === "development" ? err.stack : undefined;

	// Create a consistent JSON response using ApiResponse
	const response = new ApiResponse(
		statusCode,
		null, // No data for errors
		message,
		stack // Automatically include stack if in development
	);

	// Log the stack trace to the server console for debugging
	if (statusCode >= 500) {
		console.error(err.stack);
	}

	// Return the JSON response
	res.status(statusCode).json(response);
};

export { errorHandler };
