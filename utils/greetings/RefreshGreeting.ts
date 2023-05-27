import Greeting from "../../models/greetings/Greeting"
import cronParser from "cron-parser"

export const RefreshGreeting = async (job_id: string) => {
    let greeting = await Greeting.findById(job_id.split(",")[0]).populate('refresh_trigger')
    console.log(`refreshing greeting for ${greeting?.greeting_image}`)
    if (greeting && greeting.refresh_trigger) {
        await Greeting.findByIdAndUpdate(greeting._id, { next_refresh_date: cronParser.parseExpression(greeting.refresh_trigger.cronString).next().toDate() })
    }
}