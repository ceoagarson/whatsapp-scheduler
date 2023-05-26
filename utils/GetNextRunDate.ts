import { IFrequency } from "../types/task.type";
import { GetMonthDays } from "./GetMonthDays";
import { SortUniqueNumbers } from "./SortUniqueNumbers";


export function GetNextRunDate(frequency: IFrequency, next_run: Date) {
   let mf = frequency?.minutes
   let hf = frequency?.hours
   let df = frequency?.days
   let monthf = frequency?.months
   let weekdays = frequency?.weekdays
   let monthdays = frequency?.monthdays
   if (!next_run)
      next_run = new Date()

   if (mf && mf > 4) {
      for (let i = 1; i <= 60; i += mf) {
         if (i > next_run.getMinutes()) {
            next_run = new Date(next_run.getMinutes() + (i - next_run.getMinutes()))
            break
         }

      }
   }
   if (hf && hf > 0) {
      for (let i = 1; i <= 24; i += hf) {
         if (i > next_run.getHours()) {
            next_run = new Date(next_run.getHours() + (i - next_run.getHours()))
            break
         }

      }

   }
   if (df && df > 0) {
      for (let i = 1; i <= GetMonthDays(next_run.getFullYear(), next_run.getMonth()); i += df) {
         if (i > next_run.getDate()) {
            next_run = new Date(next_run.getDate() + (i - next_run.getDate()))
            break
         }
      }
   }

   if (monthf && monthf > 0) {
      for (let i = 1; i <= 12; i += monthf) {
         if (i > next_run.getMonth()) {
            next_run = new Date(next_run.getMonth() + (i - next_run.getMonth()))
            break
         }
      }
   }

   if (weekdays && weekdays.length > 0) {
      let tempWeekdays:number[]=[]
      weekdays.split(",").forEach((wdd) => {
         let wd=0
         wd=Number(wdd)
         tempWeekdays.push(wd)
      })
      tempWeekdays=SortUniqueNumbers(tempWeekdays)

      for (let i = 1; i <= tempWeekdays.length; i++) {
         if (tempWeekdays[i] ===next_run.getDay()) {
            next_run = new Date(next_run.getDay() + (tempWeekdays[i + 1] - next_run.getDay()))
            break
         }
      }
   }
   if (monthdays && monthdays.length > 0) {
      let tempMonthdays: number[] = []
      monthdays.split(",").forEach((wdd) => {
         let wd = 0
         wd = Number(wdd)
         tempMonthdays.push(wd)
      })
      tempMonthdays = SortUniqueNumbers(tempMonthdays)

      for (let i = 1; i <= tempMonthdays.length; i++) {
         if (tempMonthdays[i] === next_run.getDay()) {
            next_run = new Date(next_run.getDate() + (tempMonthdays[i + 1] - next_run.getDate()))
            break
         }
      }
   }

   return next_run
}