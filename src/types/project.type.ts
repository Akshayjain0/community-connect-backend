// types/project.type.ts
export interface IProject {
	_id: string; // UUID
	title: string;
	description: string;

	// 🆕 Updated location structure
	state: string;
	city: string;
	locality: string;

	domain_id: string; // UUID
	subdomain_ids: string[]; // UUIDs of subdomains
	time_commitment: string;
	organizer_id: string; // UUID
	interested_volunteers: string[]; // UUIDs of volunteers

	created_at: Date;
	updated_at: Date;
}
