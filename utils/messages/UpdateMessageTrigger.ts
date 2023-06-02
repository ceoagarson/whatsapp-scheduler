import { MessageManager } from "../..";
import Frequency from "../../models/Frequency";
import Message from "../../models/messages/Message";
import MessageRefreshTrigger from "../../models/messages/MessageRefreshTrigger";
import MessageTrigger from "../../models/messages/MessageTrigger";
import { IMessage } from "../../types/messages.type";
import { GetRefreshDateCronString } from "../GetRefreshDateCronString";
import { GetRunningDateCronString } from "../GetRunningDateCronString";
import { RefreshMessage } from "./RefreshMessage";
import { SendMessageWhatsapp } from "./SendMessageWhatsapp";
import cronParser from "cron-parser";


export async function UpdateMessageTrigger(message: IMessage) {
    if (message.frequency) {
        let frequency = await Frequency.findById(message.frequency._id)
        if (frequency) {
            let runstring = GetRunningDateCronString(frequency, message.start_date)
            let refstring = GetRefreshDateCronString(frequency, message.start_date)

            if (message.running_trigger && message.refresh_trigger && message.frequency) {
                if (runstring) {
                    await MessageTrigger.findByIdAndUpdate(message.running_trigger._id, {
                        cronString: runstring,
                        updated_at: new Date()
                    })
                    if (MessageManager.exists(message.running_trigger.key)) {
                        MessageManager.update(message.running_trigger.key, runstring, () => { SendMessageWhatsapp(message._id) })
                    }
                    await Message.findByIdAndUpdate(message._id,
                        {
                            next_run_date: cronParser.parseExpression(runstring).next().toDate()
                        }
                    )
                }

                if (refstring) {
                    await MessageRefreshTrigger.findByIdAndUpdate(message.refresh_trigger._id, {
                        cronString: refstring,
                        updated_at: new Date()
                    })
                    if (MessageManager.exists(message.refresh_trigger.key)) {
                        MessageManager.update(message.refresh_trigger.key, refstring, () => { RefreshMessage(message._id) })
                    }
                    await Message.findByIdAndUpdate(message._id,
                        {
                            next_refresh_date: cronParser.parseExpression(refstring).next().toDate()
                        }
                    )
                }
            }
        }
    }
}
