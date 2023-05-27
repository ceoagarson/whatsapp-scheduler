import express from "express";
import { CreateGreeting, DeleteGreeting, GetGreetings, StartGreetingScheduler } from "../controllers/greetng.controller";

const router = express.Router()

router.route("/greetings")
    .get(GetGreetings)
    .post(CreateGreeting)
router.route("/greetings/:id")
    .delete(DeleteGreeting)
router.route("/greetings/start")
    .post(StartGreetingScheduler)

export default router