import express from "express";
import { CreateTask, GetTasks } from "../controllers/task.controller";

const router = express.Router()

router.route("/tasks")
    .get(GetTasks)
    .post(CreateTask)


export default router