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
import cronParser from "cron";
import CronJobManager from "cron-job-manager";


export async function CreateMessageTrigger(message: IMessage) {
    if (message.frequency) {
        let frequency = await Frequency.findById(message.frequency._id)
        if (frequency) {
            let runstring = GetRunningDateCronString(frequency, message.start_date)
            let refstring = GetRefreshDateCronString(frequency, message.start_date)

            if (!message.running_trigger && !message.refresh_trigger && message.frequency) {
                if (runstring) {
                    let running_trigger = new MessageTrigger({
                        key: message._id + "," + "run",
                        cronString: runstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        message: message
                    })
                    await running_trigger.save()
                    await Message.findByIdAndUpdate(message._id,
                        {
                            running_trigger: running_trigger, next_run_date: new Date(cronParser.sendAt(runstring).toJSDate()),
                            autoStop: false,
                            autoRefresh: true
                        }
                    )
                    if (running_trigger) {
                        MessageManager.add(running_trigger.key, runstring, () => { SendMessageWhatsapp(message._id) })
                        MessageManager.start(running_trigger.key)
                    }
                }
                if (refstring) {
                    let refresh_trigger = new MessageRefreshTrigger({
                        key: message._id + "," + "refresh",
                        cronString: refstring,
                        created_at: new Date(),
                        updated_at: new Date(),
                        message: message
                    })

                    await refresh_trigger.save()
                    await Message.findByIdAndUpdate(message._id,
                        {
                            refresh_trigger: refresh_trigger, next_refresh_date: new Date(cronParser.sendAt(refstring).toJSDate()),
                            autoStop: false,
                            autoRefresh: true
                        })

                    if (refresh_trigger) {
                        MessageManager.add(refresh_trigger.key, refstring, () => { RefreshMessage(message._id) })
                        MessageManager.start(refresh_trigger.key)
                    }

                }
            }
            if (message.running_trigger && message.refresh_trigger && message.frequency) {
                await Message.findByIdAndUpdate(message._id,
                    {
                        autoStop: false,
                        autoRefresh: true
                    }
                )
            }
        }
    }
    else {
        new CronJobManager('a one-timer', new Date(message.start_date), () => { SendMessageWhatsapp(message._id) }).start('a one-timer')
        await Message.findByIdAndUpdate(message._id, { run_once: true,autoStop:false })
    }
}