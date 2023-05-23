import express from "express";
import { Index } from "../controllers/task.controller";

const router = express.Router()

router.route("/").get(Index)

export default router