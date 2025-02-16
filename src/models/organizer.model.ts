import mongoose, { Schema } from "mongoose";
import { IOrganizer } from "../types/organizer.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();
const OrganizerSchema = new Schema<IOrganizer>({
	_id: { type: String, required: true, unique: true, default: uuidv4 }, // UUID
	organizer_name: { type: String, required: true },
	userName: { type: String, required: true, unique: true },
	contact_number: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	location: { type: String, required: true },
	created_projects: [{ type: Schema.Types.String, ref: "Project" }], // UUIDs of projects
	logo: { type: String, required: false },
	refreshToken: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

OrganizerSchema.pre<IOrganizer>("save", async function (next) {
	if (!this.isModified("password")) return next;
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

OrganizerSchema.methods.isPasswordCorrect = async function (
	password: string | Buffer<ArrayBufferLike>
) {
	return await bcrypt.compare(password, this.password);
};

OrganizerSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			organizer_name: this.organizer_name,
		},
		process.env.ACCESS_TOKEN_SECRET as string,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
OrganizerSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET as string,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

// Automatically remove sensitive fields from responses
OrganizerSchema.set("toJSON", {
	transform: function (_, ret) {
		delete ret.password;
		delete ret.refreshToken;
		return ret;
	},
});

const Organizer = mongoose.model<IOrganizer>("Organizer", OrganizerSchema);
export default Organizer;
