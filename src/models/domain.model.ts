import mongoose, { Schema } from "mongoose";
import { IDomain } from "../types/domain.type";

const SubdomainSchema = new Schema({
	id: { type: String, required: true }, // UUID
	sub_domain_name: { type: String, required: true },
});

const DomainSchema = new Schema<IDomain>({
	id: { type: String, required: true, unique: true }, // UUID
	domain_name: { type: String, required: true },
	subdomains: { type: [SubdomainSchema], default: [] }, // Embedded subdomains
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Domain = mongoose.model<IDomain>("Domain", DomainSchema);
export default Domain;
