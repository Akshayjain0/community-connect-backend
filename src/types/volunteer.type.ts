export interface IInterestedDomain {
	domain_id: string; // Refers to Domain
	subdomain_ids: string[]; // UUIDs of subdomains
}

export interface IVolunteer {
	_id: string; // UUID
	fullName: string;
	userName: string;
	email: string;
	password: string;
	state: string;
	city: string;
	locality: string;
	// location: string;
	interested_domains: IInterestedDomain[];
	volunteer_status: string;
	willing_to_work_in_other_domains: boolean;
	availability: string;
	joined_projects: string[]; // UUIDs of projects
	profile_picture: string;
	refreshToken: string;
	interested_projects: string[];
	isModified(path: string): boolean;
	generateAccessToken(role: string): string;
	generateRefreshToken(role: string): string;
	isPasswordCorrect(password: string): Promise<boolean>;
	created_at: Date;
	updated_at: Date;
}
