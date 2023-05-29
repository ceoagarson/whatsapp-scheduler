import Message from "../../models/messages/Message"
import cronParser from "cron-parser"

export const RefreshMessage = async (job_id: string) => {
    let message = await Message.findById(job_id.split(",")[0]).populate('refresh_trigger')
    console.log(`refreshing message for ${message?.message_image}`)
    if (message && message.refresh_trigger) {
        await Message.findByIdAndUpdate(message._id, { next_refresh_date: cronParser.parseExpression(message.refresh_trigger.cronString).next().toDate() })
    }
}