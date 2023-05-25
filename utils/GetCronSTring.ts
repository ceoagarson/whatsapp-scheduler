import { IFrequency } from "../types/task.type"

export const GetCronString = (frequency: IFrequency,start_date:Date) => {
    start_date=new Date(start_date)
    let mf =frequency?.minutes
    let hf =frequency?.hours
    let df =frequency?.days
    let monthf =frequency?.months
    let weekdays =frequency?.weekdays
    let monthdays =frequency?.monthdays
  
    let cronString =undefined
    if (mf&&mf > 0) {
        cronString = "0-59" + `/${mf}` + " * * * *"
    }
    if (hf&&hf > 0) {
        cronString = `${start_date.getMinutes()}` + " 0/" + `${hf}` + " * * *"
    }
    if (df&&df > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + "1/" + `${df}` + " *" + " *"
    }
   
    if (monthf&&monthf > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + `${start_date.getDate()}` + " 1/" + `${monthf}` + " *"
    }

    if (weekdays&&weekdays.length > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + " *" + " * " + weekdays
    }

    if (monthdays && monthdays.length > 0) {
        cronString = `${start_date.getMinutes()} ` + `${start_date.getHours()} ` + monthdays
            + " * " + "*"
    }
    
    return cronString
}
