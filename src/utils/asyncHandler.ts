import { Request, Response, NextFunction } from "express";

// Define a custom error interface
interface CustomError extends Error {
	code?: number;
}

// Define the type for the async handler function
type AsyncHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void>;

// Create the asyncHandler function with proper types
const asyncHandler =
	(fn: AsyncHandler) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			const err = error as CustomError; // Type assertion to CustomError
			res.status(err.code || 500).json({
				success: false,
				message: err.message,
			});
		}
	};

export default asyncHandler;
