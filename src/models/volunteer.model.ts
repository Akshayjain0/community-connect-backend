import mongoose, { Schema } from "mongoose";
import { IVolunteer } from "../types/volunteer.type";

const InterestedDomainSchema = new Schema({
  domain_id: { type: Schema.Types.String, ref: "Domain", required: true },
  subdomain_ids: [{ type: Schema.Types.String }], // Array of references to Subdomains
});

const VolunteerSchema = new Schema<IVolunteer>({
  id: { type: String, required: true, unique: true }, // UUID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  interested_domains: { type: [InterestedDomainSchema], default: [] },
  volunteer_status: { type: String, required: true },
  willing_to_work_in_other_domains: { type: Boolean, default: false },
  availability: { type: String, required: true },
  joined_projects: [{ type: Schema.Types.String, ref: "Project" }], // UUIDs of projects
  profile_picture: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Volunteer = mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
export default Volunteer;
