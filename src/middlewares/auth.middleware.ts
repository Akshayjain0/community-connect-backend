// import { NextFunction, Request, Response } from "express";
// import asyncHandler from "express-async-handler";
// import createError from "http-errors";
// import jwt from "jsonwebtoken";
// import Volunteer from "../models/volunteer.model";
// import Organizer from "../models/organizer.model";
// import { TokenPayload } from "../types/auth.types";

// export const auth = asyncHandler(
// 	async (req: Request, res: Response, next: NextFunction) => {
// 		try {
// 			// 🔹 Retrieve token from cookies or authorization header
// 			const token =
// 				req.cookies?.accessToken ||
// 				req.header("Authorization")?.replace("Bearer ", "");

// 			if (!token) {
// 				return next(
// 					createError(401, "Unauthorized request: No token provided.")
// 				);
// 			}

// 			// 🔹 Verify JWT
// 			const decodedToken = jwt.verify(
// 				token,
// 				process.env.TOKEN_SECRET as string
// 			) as TokenPayload;

// 			let user;
// 			if (decodedToken.role === "volunteer") {
// 				user = await Volunteer.findById(decodedToken._id).select(
// 					"-password"
// 				);
// 			} else if (decodedToken.role === "organizer") {
// 				user = await Organizer.findById(decodedToken._id).select(
// 					"-password"
// 				);
// 			}

// 			if (!user) {
// 				return next(createError(404, "User not found."));
// 			}

// 			// 🔹 Attach user and role to request
// 			console.log("User", user)
// 			req.user = user;
// 			req.role = decodedToken.role;

// 			next();
// 		} catch (error: unknown) {
// 			return next(createError(401, `${error}---->from auth middleware`));
// 		}
// 	}
// );

// middleware/auth.ts
// middleware/auth.ts
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import Volunteer from "../models/volunteer.model";
import Organizer from "../models/organizer.model";
import { TokenPayload } from "../types/auth.types";

export const auth = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const accessToken =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");
		const refreshToken = req.cookies?.refreshToken;

		const attachUserAndContinue = async (decoded: TokenPayload) => {
			const user = await getUser(decoded);
			if (!user) throw createError(404, "User not found");

			console.log(
				"✅ Access granted for user:",
				decoded.email || decoded._id
			);
			req.user = user;
			req.role = decoded.role;
			return next();
		};
		console.log("process.env.TOKEN_SECRET", process.env.TOKEN_SECRET);
		try {
			if (!accessToken)
				throw new TokenExpiredError("No access token", new Date());
			console.log("process.env.TOKEN_SECRET", process.env.TOKEN_SECRET);
			const decoded = jwt.verify(
				accessToken,
				process.env.TOKEN_SECRET!
			) as TokenPayload;
			console.log(
				"✅ Access token valid for:",
				decoded.email || decoded._id
			);
			return await attachUserAndContinue(decoded);
		} catch (err) {
			if (!(err instanceof TokenExpiredError)) {
				console.warn("❌ Invalid access token");
				return next(createError(401, "Invalid token"));
			}

			try {
				if (!refreshToken)
					throw createError(401, "No refresh token available");

				const decodedRefresh = jwt.verify(
					refreshToken,
					process.env.TOKEN_SECRET!
				) as TokenPayload;
				const user = await getUser(decodedRefresh);
				if (!user)
					throw createError(401, "User not found for refresh token");

				const newAccessToken = jwt.sign(
					{
						_id: user._id,
						role: decodedRefresh.role,
						email: user.email,
					},
					process.env.TOKEN_SECRET!,
					{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
				);

				res.cookie("accessToken", newAccessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "none",
					maxAge: 1000 * 60 * 15,
				});

				console.log(
					"🔁 Access token refreshed for:",
					decodedRefresh.email || decodedRefresh._id
				);
				req.user = user;
				req.role = decodedRefresh.role;
				return next();
			} catch (refreshErr) {
				console.warn("❌ Failed to refresh access token");
				res.clearCookie("accessToken");
				res.clearCookie("refreshToken");
				return next(
					createError(403, "Invalid or expired refresh token")
				);
			}
		}
	}
);

const getUser = async (decoded: TokenPayload) => {
	if (decoded.role === "volunteer") {
		return await Volunteer.findById(decoded._id).select("-password");
	} else if (decoded.role === "organizer") {
		return await Organizer.findById(decoded._id).select("-password");
	}
	return null;
};
