import express from "express";
import { DeleteJob, Index, StartJob, StopJob, UpdateJob } from "../controllers/task.controller";

const router = express.Router()

router.get("/", Index)
router.get("/start", StartJob)
router.get("/stop",StopJob)
router.get("/delete",DeleteJob)
router.get("/update",UpdateJob)

export default router