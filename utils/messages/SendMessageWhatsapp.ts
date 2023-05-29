import cronParser from "cron-parser"
import Message from "../../models/messages/Message"

export const SendMessageWhatsapp = async (job_id: string) => {
    let message = await Message.findById(job_id.split(",")[0]).populate('running_trigger')
    console.log(`whatsapp sent for ${message?.message_image}`)
    if (message && message.running_trigger) {
        await Message.findByIdAndUpdate(message._id, { next_run_date: cronParser.parseExpression(message.running_trigger.cronString).next().toDate() })
    }
}