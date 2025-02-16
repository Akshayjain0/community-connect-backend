import { TokenPayload } from "./auth.types";
import { IOrganizer } from "./organizer.type";
import { IVolunteer } from "./volunteer.type";

declare global {
	namespace Express {
		interface Request {
			user?: IVolunteer | IOrganizer; // Can be Volunteer or Organizer
			role?: TokenPayload["role"];
		}
	}
}
