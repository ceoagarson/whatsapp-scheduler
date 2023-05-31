import Message from "../../models/messages/Message"
import cronParser from "cron-parser"

export const RefreshMessage = async (task_id: string) => {
    let message = await Message.findById(task_id).populate('refresh_trigger')
    if (message) {
        if (message.autoRefresh) {
            await Message.findByIdAndUpdate(message._id, {
                message_status: "pending",
                whatsapp_status: "",
                autoStop: false,
                message_timestamp: new Date(),
                whatsapp_timestamp: null
            })
        }
    }
    if (message && message.refresh_trigger) {
        await Message.findByIdAndUpdate(message._id, { next_refresh_date: cronParser.parseExpression(message.refresh_trigger.cronString).next().toDate() })
    }
}