// import { Request, Response, NextFunction } from "express";
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import ApiResponse from "../utils/apiResponse";
// // import ApiResponse from "../utils/apiResponse";

// // Example route: GET /api/example
// const getExampleData = asyncHandler(
// 	async (req: Request, res: Response, next: NextFunction) => {
// 		const queryParam = req.query.param;

// 		if (!queryParam || typeof queryParam !== "string") {
// 			return next(
// 				createError(
// 					400,
// 					"Query parameter 'param' is required and must be a string."
// 				)
// 			);
// 		}
// 		// Simulate success response
// 		const response = new ApiResponse(
// 			200,
// 			null,
// 			"Data retrieved successfully"
// 		);
// 		res.status(200).json(response);
// 	}
// );
// // Example route: GET /api/error
// const simulateError = asyncHandler(
// 	async (req: Request, res: Response, next: NextFunction) => {
// 		// Simulate an unexpected error
// 		throw createError(501, "Simulated internal server error");
// 	}
// );

// export { getExampleData, simulateError };
