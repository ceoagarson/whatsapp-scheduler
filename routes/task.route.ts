import express from "express";
import { CreateTask, DeleteTask, GetTasks,  StartTaskScheduler, StopSingleTaskScheduler, StopTaskScheduler, UpdateTask } from "../controllers/task.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";

const router = express.Router()

router.route("/tasks")
    .get(GetTasks)
    .post(isAuthenticatedUser, isAdmin, CreateTask)
router.route("/tasks/:id")
    .delete(isAuthenticatedUser, isAdmin, DeleteTask)
    .put(isAuthenticatedUser, isAdmin, UpdateTask)
router.route("/tasks/start")
    .post(isAuthenticatedUser, isAdmin, StartTaskScheduler)
router.route("/tasks/stop")
    .post(isAuthenticatedUser, isAdmin, StopTaskScheduler)
router.route("/tasks/stop/:id")
    .post(isAuthenticatedUser, isAdmin, StopSingleTaskScheduler)

export default router