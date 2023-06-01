import cronParser from "cron-parser"
import Task from "../../models/tasks/Task"
import axios from "axios"

export const SendTaskWhatsapp = async (task_id: string) => {
    let task = await Task.findById(task_id).populate('running_trigger')
    if (task) {
        if (task.run_once)
            await Task.findByIdAndUpdate(task._id, { run_once: false })
        if (!task?.autoStop) {
            try {
                let token = process.env.accessToken
                let phone_id = process.env.phone_id
                let url = `https://graph.facebook.com/v16.0/${phone_id}/messages`;
                let data = {
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": task.phone,
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
                                        "text": task.task_title
                                    }
                                ]
                            },
                            {
                                "type": "body",
                                "parameters": [
                                    {
                                        "type": "text",
                                        "text": task.task_detail
                                    }
                                ]
                            }
                        ]
                    }
                }
                let config = {
                    url:url,
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    data:JSON.stringify(data)
                };

                let response: any = await axios.request(config)
                const { messages } = JSON.parse(response)
                if (messages.length > 0) {
                    await Task.findByIdAndUpdate(task._id, { message_id: messages[0].id })
                }
            }
            catch (err:any) {
                console.log(err.response)
            }
        }
        if (task && task.running_trigger) {
            await Task.findByIdAndUpdate(task._id, { next_run_date: cronParser.parseExpression(task.running_trigger.cronString).next().toDate() })
        }
    }

}
