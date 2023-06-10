import { MessageManager } from "../.."
import Message from "../../models/messages/Message"
import { RefreshMessage } from "./RefreshMessage"
import { SendMessageWhatsapp } from "./SendMessageWhatsapp"

export async function RestartMessageJobs() {
    let messages = await Message.find().populate("running_trigger").populate('refresh_trigger')
    messages.forEach(async (message) => {
        let running_trigger = message.running_trigger
        let refresh_trigger = message.refresh_trigger
        let runsring = running_trigger?.cronString
        let refstring = refresh_trigger?.cronString
        if (running_trigger && runsring) {
            MessageManager.add(running_trigger.key, runsring, () => {
                SendMessageWhatsapp(message._id)
            })
            MessageManager.start(running_trigger.key)
        }
        if (refresh_trigger && refstring) {
            MessageManager.add(refresh_trigger.key, refstring, () => {
                RefreshMessage(message._id)
            })
            MessageManager.start(refresh_trigger.key)
        }
        if (message.run_once) {
            MessageManager.add(message._id + "once", new Date(message.start_date), () => { SendMessageWhatsapp(message._id) })
            MessageManager.start(message._id + "once")
        }

    })
}
