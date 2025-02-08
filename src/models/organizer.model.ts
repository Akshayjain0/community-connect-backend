import mongoose, { Schema } from "mongoose";
import { IOrganizer } from "../types/organizer.type";

const OrganizerSchema = new Schema<IOrganizer>({
	id: { type: String, required: true, unique: true }, // UUID
	organization_name: { type: String, required: true },
	contact_person: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	location: { type: String, required: true },
	created_projects: [{ type: Schema.Types.String, ref: "Project" }], // UUIDs of projects
	logo: { type: String, required: false },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Organizer = mongoose.model<IOrganizer>("Organizer", OrganizerSchema);
export default Organizer;
