import cronParser from "cron-parser"
import Greeting from "../../models/greetings/Greeting"

export const SendGreetingWhatsapp = async (job_id: string) => {
    let greeting = await Greeting.findById(job_id.split(",")[0]).populate('running_trigger')
    console.log(`whatsapp sent for ${greeting?.greeting_image}`)
    if (greeting && greeting.running_trigger) {
        await Greeting.findByIdAndUpdate(greeting._id, { next_run_date: cronParser.parseExpression(greeting.running_trigger.cronString).next().toDate() })
    }
}