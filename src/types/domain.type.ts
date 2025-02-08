export interface ISubdomain {
	id: string; // UUID
	sub_domain_name: string;
}

export interface IDomain {
	id: string; // UUID
	domain_name: string;
	subdomains: ISubdomain[];
	created_at: Date;
	updated_at: Date;
}
