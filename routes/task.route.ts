import express from "express";
import { CreateTask, GetTasks, StartTaskScheduler } from "../controllers/task.controller";

const router = express.Router()

router.route("/tasks")
    .get(GetTasks)
    .post(CreateTask)
router.route("/tasks/start")
    .post(StartTaskScheduler)

export default router