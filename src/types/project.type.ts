export interface IProject {
  id: string; // UUID
  title: string;
  description: string;
  location: string;
  domain_id: string; // UUID
  subdomain_ids: string[]; // UUIDs of subdomains
  time_commitment: string;
  organizer_id: string; // UUID
  interested_volunteers: string[]; // UUIDs of volunteers
  created_at: Date;
  updated_at: Date;
}
