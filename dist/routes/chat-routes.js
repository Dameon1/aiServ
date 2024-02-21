import { Router } from 'express';
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidators, validate } from "../utils/validators.js";
import { generateChatCompletion } from '../controllers/chat-controllers.js';
const chatRoutes = Router();
chatRoutes.post("/new", validate(chatCompletionValidators), verifyToken, generateChatCompletion);
export default chatRoutes;
//# sourceMappingURL=chat-routes.js.map