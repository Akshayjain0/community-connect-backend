import mongoose, { Schema } from "mongoose";
import { IVolunteer } from "../types/volunteer.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const InterestedDomainSchema = new Schema({
	domain_id: { type: Schema.Types.String, ref: "Domain", required: true },
	subdomain_ids: [{ type: Schema.Types.String }], // Array of references to Subdomains
});

const VolunteerSchema = new Schema<IVolunteer>({
	_id: { type: String, required: true, unique: true, default: uuidv4 }, // UUID
	fullName: { type: String, required: true },
	userName: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	location: { type: String, required: true },
	interested_domains: { type: [InterestedDomainSchema], default: [] },
	volunteer_status: { type: String, required: true },
	willing_to_work_in_other_domains: { type: Boolean, default: false },
	availability: { type: String, required: true },
	joined_projects: [{ type: Schema.Types.String, ref: "Project" }], // UUIDs of projects
	profile_picture: { type: String, required: false },
	refreshToken: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

VolunteerSchema.pre<IVolunteer>("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

VolunteerSchema.methods.isPasswordCorrect = async function (
	password: string | Buffer<ArrayBufferLike>
) {
	return await bcrypt.compare(password, this.password);
};

VolunteerSchema.methods.generateAccessToken = function (
	role: "volunteer" | "organizer"
) {
	return jwt.sign(
		{
			_id: this._id,
			role: role,
			email: this.email,
			fullName: this.fullName,
		},
		process.env.TOKEN_SECRET as string,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};

VolunteerSchema.methods.generateRefreshToken = function (
	role: "volunteer" | "organizer"
) {
	return jwt.sign(
		{
			_id: this._id,
			role: role,
		},
		process.env.TOKEN_SECRET as string,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

// Automatically remove sensitive fields from responses
VolunteerSchema.set("toJSON", {
	transform: function (_, ret) {
		delete ret.password;
		delete ret.refreshToken;
		return ret;
	},
});

const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
export default Volunteer;
