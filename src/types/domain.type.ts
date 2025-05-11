export interface ISubdomain {
	_id: string; // UUID
	sub_domain_name: string;
}

export interface IDomain {
	_id: string; // UUID
	domain_name: string;
	subdomains: ISubdomain[];
	created_at: Date;
	updated_at: Date;
}
