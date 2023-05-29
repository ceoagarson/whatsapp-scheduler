import mongoose from "mongoose";
import { IMessageTrigger } from "../../types/messages.type";

const MessageTriggerSchema = new mongoose.Schema<IMessageTrigger, mongoose.Model<IMessageTrigger>>({
    key: {
        type: String,
        required: true,
        trim: true,
        index: true,
        lowercase: true,
    }
    ,
    cronString: {
        type: String,
        required: true,
        trim: true
    },
    created_at: Date,
    updated_at: Date,
    message:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }
})
const MessageTrigger = mongoose.model<IMessageTrigger, mongoose.Model<IMessageTrigger>>("MessageTrigger", MessageTriggerSchema);

export default MessageTrigger;