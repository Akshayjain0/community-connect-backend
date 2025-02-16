export interface TokenPayload {
	_id: string;
	role: "volunteer" | "organizer";
	email?: string;
	organizer_name?: string;
	fullName?: string;
	iat?: number;
	exp?: number;
}
