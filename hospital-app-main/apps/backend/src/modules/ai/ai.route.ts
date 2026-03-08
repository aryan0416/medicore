import { Router } from "express";
import { chatWithAI } from "./ai.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// Endpoint: POST /api/ai/chat
// We apply authenticate middleware so only logged-in users can use the AI chat
router.post("/chat", authenticate, chatWithAI);

export default router;
