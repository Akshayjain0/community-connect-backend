import mongoose, { Schema } from "mongoose";
import { IMessage } from "../types/message.type";

const MessageSchema = new Schema<IMessage>({
	id: { type: String, required: true, unique: true }, // UUID
	sender_id: {
		type: Schema.Types.String,
		required: true,
		refPath: "sender_model",
	}, // UUID
	receiver_id: {
		type: Schema.Types.String,
		required: true,
		refPath: "receiver_model",
	}, // UUID
	project_id: { type: Schema.Types.String, ref: "Project", required: true }, // UUID
	message_content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
