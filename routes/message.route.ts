import express from "express";
import { CreateMessage, DeleteMessage, GetMessages, StartMessageScheduler } from "../controllers/greetng.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";

const router = express.Router()

router.route("/messages")
    .get(GetMessages)
    .post(isAuthenticatedUser, isAdmin,CreateMessage)
router.route("/messages/:id")
    .delete(isAuthenticatedUser, isAdmin,DeleteMessage)
router.route("/messages/start")
    .post(isAuthenticatedUser, isAdmin,StartMessageScheduler)

export default router