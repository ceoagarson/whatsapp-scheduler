import express from "express";
import { Index } from "../controllers/task.controller";

const router = express.Router()

router.get("/", Index)


export default router