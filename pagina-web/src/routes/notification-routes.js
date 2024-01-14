import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getMessage, sendMessage, deleteMessage } from "../controllers/notification-controller.js";
import { validateSchema } from "../middlewares/validator-midd.js";
import { messagesSchema } from "../schemas/notification-schema.js"

const router = Router();
router.get("/notification", authRequired, getMessage);
router.post("/notification", validateSchema(messagesSchema), sendMessage);
router.delete("/notification/:id", authRequired, deleteMessage);

export default router 