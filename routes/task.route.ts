import express from "express";
import { CreateTask, GetTasks, Index, StartTaskScheduler } from "../controllers/task.controller";

const router = express.Router()

router.get("/",Index)
router.route("/tasks")
    .get(GetTasks)
    .post(CreateTask)
router.route("/tasks/start")
    .post(StartTaskScheduler)

export default router