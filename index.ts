// imports package and modules
import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';
import morgan from "morgan";
import CronJobManager from "cron-job-manager";
import { connectDatabase } from './config/db';
import TaskRouter from "./routes/task.route";
import { RestartTaskJobs } from './utils/RestartTaskJobs';
import { RestartGreetingJobs } from './utils/greetings/RestartGreetingJobs';

//exress app
const app = express()
dotenv.config();
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || "http://localhost"
const ENV = process.env.NODE_ENV

//middlewares
app.use(express.json())
app.use(cookieParser());
app.use(morgan('tiny'))

if (String(ENV) === "devlopment") {
    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true
    }))
}


//connect database
connectDatabase();

//cron job manager for tasks
export const TaskManager = new CronJobManager()
export const GreetingManager = new CronJobManager() 

//app routes
app.use("/api/v1", TaskRouter)

if (!TaskManager.exists('check_status')) {
    TaskManager.add("check_status", "15 * * * *", () => console.log("checked status of all jobs "))
    console.log("restarted all task cron jobs")
    RestartTaskJobs()
}
if (!GreetingManager.exists('check_greeting_status')) {
    GreetingManager.add("check_greeting_status", "15 * * * *", () => console.log("checked status of all jobs "))
    console.log("restarted all greeting cron jobs")
    RestartGreetingJobs()
}

//serve client
if (ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "build/", "index.html"));
    })
}
else {
    app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
        res.status(404).json({ message: "resource not found" })
    })
}

//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({
        message: err.message || "unknown  error occured"
    })
    
})

//start server based on selected port
if (!PORT) {
    console.log("Server Port not specified in the environment")
    process.exit(1)
}


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});