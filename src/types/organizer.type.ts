export interface IOrganizer {
	_id: string; // UUID
	organizer_name: string;
	userName: string;
	contact_number: string;
	email: string;
	password: string;
	state: string;
	city: string;
	locality: string;
	created_projects: string[]; // UUIDs of projects
	logo: string;
	refreshToken: string;
	isModified(path: string): boolean;
	generateAccessToken(role: string): string;
	generateRefreshToken(role: string): string;
	isPasswordCorrect(password: string): Promise<boolean>;
	created_at: Date;
	updated_at: Date;
}
