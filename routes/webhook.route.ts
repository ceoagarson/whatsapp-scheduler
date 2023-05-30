import express from "express";
import { ConnectWhatsapp, ResponseWhatsapp } from "../controllers/webhook.controller";

const router = express.Router()

router.route("/webhook")
    .get(ConnectWhatsapp)
    .post(ResponseWhatsapp)

export default router