import cronParser from "cron-parser"
import Task from "../../models/tasks/Task"

export const SendTaskWhatsapp = async (job_id: string) => {
    let task = await Task.findById(job_id.split(",")[0]).populate('running_trigger')
    if (!task?.autostop)
        console.log(`whatsapp sent for ${task?.task_title}`)
    if (task && task.running_trigger) {
        await Task.findByIdAndUpdate(task._id, { next_run_date: cronParser.parseExpression(task.running_trigger.cronString).next().toDate() })
    }
}

function SendTaskMessage(e: GoogleAppsScript.Events.TimeDriven) {
    let phone_id = PropertiesService.getScriptProperties().getProperty('phone_id')
    let triggers = findAllTaskTriggers().filter((trigger) => {
        if (trigger.trigger_id === e.triggerUid && trigger.trigger_type === "SendTaskMessage") {
            return trigger
        }
    })

    if (triggers.length > 0) {

        if (!TaskAutoStop(triggers[0].id)) {
            try {
                let token = PropertiesService.getScriptProperties().getProperty('accessToken')
                let url = `https://graph.facebook.com/v16.0/${phone_id}/messages`;
                let data = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": triggers[0].phone,
                    "type": "template",
                    "template": {
                        "name": "scheduler_with_response_",
                        "language": {
                            "code": "en_US"
                        },
                        "components": [
                            {
                                "type": "header",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": triggers[0].task_title
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": triggers[0].task_detail
                                    }
                                ]
                            }
                        ]
                    }
                }
                let options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
                    "method": "post",
                    "headers": {
                        "Authorization": `Bearer ${token}`
                    },
                    "contentType": "application/json",
                    "payload": JSON.stringify(data)
                };

                let response = UrlFetchApp.fetch(url, options)
                const { messages } = JSON.parse(response.getContentText())
                if (messages.length > 0) {
                    SetTaskMessageId(triggers[0].id, messages[0].id)
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        let index = findIndexOfTaskById(triggers[0].id)
        if (index) {
            TaskLastDateUpdater(index)
        }
    }
}
