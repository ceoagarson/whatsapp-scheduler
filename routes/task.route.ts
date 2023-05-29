import express from "express";
import { CreateTask, DeleteTask, GetTasks, Index, StartTaskScheduler } from "../controllers/task.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";

const router = express.Router()

router.get("/", Index)
router.route("/tasks")
    .get(GetTasks)
    .post(isAuthenticatedUser, isAdmin, CreateTask)
router.route("/tasks/:id")
    .delete(isAuthenticatedUser, isAdmin, DeleteTask)
router.route("/tasks/start")
    .post(isAuthenticatedUser, isAdmin, StartTaskScheduler)

export default router