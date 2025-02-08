export interface IOrganizer {
	id: string; // UUID
	organization_name: string;
	contact_person: string;
	email: string;
	password: string;
	location: string;
	created_projects: string[]; // UUIDs of projects
	logo: string;
	created_at: Date;
	updated_at: Date;
}
