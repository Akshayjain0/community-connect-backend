import mongoose, { Schema } from "mongoose";
import { IProject } from "../types/project.type";
import { v4 as uuidv4 } from "uuid";

const ProjectSchema = new Schema<IProject>({
	_id: { type: String, required: true, default: uuidv4 }, // UUID
	title: { type: String, required: true },
	description: { type: String, required: true },

	// 🆕 Split location fields
	state: { type: String, required: true },
	city: { type: String, required: true },
	locality: { type: String, required: true },

	domain_id: { type: Schema.Types.String, ref: "Domain", required: true },
	subdomain_ids: [{ type: Schema.Types.String }],
	time_commitment: { type: String, required: true },
	organizer_id: {
		type: Schema.Types.String,
		ref: "Organizer",
		required: true,
	},

	interested_volunteers: [{ type: Schema.Types.String, ref: "Volunteer" }],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
