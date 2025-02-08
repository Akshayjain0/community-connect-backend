export interface IMessage {
	id: string; // UUID
	sender_id: string; // UUID
	receiver_id: string; // UUID
	project_id: string; // UUID
	message_content: string;
	timestamp: Date;
}
