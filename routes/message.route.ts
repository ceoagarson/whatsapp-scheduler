import express from "express";
import { CreateMessage, DeleteMessage, GetMessages, StartMessageScheduler, StopSingleMessageScheduler, StopMessageScheduler, UpdateMessage, StartSingleMessageScheduler, GetRecords, GetRecord } from "../controllers/message.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth.middleware";

const router = express.Router()

router.route("/messages")
    .get(GetMessages)
    .post(isAuthenticatedUser,  CreateMessage)
router.route("/messages/:id")
    .delete(isAuthenticatedUser, isAdmin, DeleteMessage)
    .put(isAuthenticatedUser, isAdmin, UpdateMessage)
router.route("/messages/start")
    .post(isAuthenticatedUser, isAdmin, StartMessageScheduler)
router.route("/messages/start/:id")
    .post(isAuthenticatedUser, isAdmin, StartSingleMessageScheduler)
router.route("/messages/stop")
    .post(isAuthenticatedUser, isAdmin, StopMessageScheduler)
router.route("/messages/stop/:id")
    .post(isAuthenticatedUser, isAdmin, StopSingleMessageScheduler)

router.route("/records")
    .get(isAuthenticatedUser, isAdmin, GetRecords)
router.route("/records/:phone")
    .get(isAuthenticatedUser, isAdmin, GetRecord)

export default router