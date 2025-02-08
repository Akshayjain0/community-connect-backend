import mongoose, { Schema } from "mongoose";
import { IProject } from "../types/project.type";

const ProjectSchema = new Schema<IProject>({
  id: { type: String, required: true, unique: true }, // UUID
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  domain_id: { type: Schema.Types.String, ref: "Domain", required: true }, // UUID
  subdomain_ids: [{ type: Schema.Types.String }], // Array of UUIDs of subdomains
  time_commitment: { type: String, required: true },
  organizer_id: { type: Schema.Types.String, ref: "Organizer", required: true }, // UUID
  interested_volunteers: [{ type: Schema.Types.String, ref: "Volunteer" }], // UUIDs of volunteers
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
