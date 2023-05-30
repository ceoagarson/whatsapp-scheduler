import Message from "../../models/messages/Message"
import cronParser from "cron-parser"

export const RefreshMessage = async (task_id:string) => {
    let message = await Message.findById(task_id).populate('refresh_trigger')
    if(message){
        if (message.autoRefresh) {
            message.message_status = "pending"
            message.whatsapp_status=""
            message.autostop=false
            message.message_timestamp=new Date()
            message.whatsapp_timestamp=null
            await message.save()
        }
        if (message && message.refresh_trigger) {
            await Message.findByIdAndUpdate(message._id, { next_refresh_date: cronParser.parseExpression(message.refresh_trigger.cronString).next().toDate() })
        }
    }
    
}