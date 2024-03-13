import { Router } from 'express';
import { verifyToken } from '../utils/token-manager.js';
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { generateChatCompletion, sendChatsToUser } from '../controllers/chat-controllers.js';

const chatRoutes = Router();
chatRoutes.post("/new",
 validate(chatCompletionValidator), verifyToken, 
generateChatCompletion);

chatRoutes.get("/all-chats", sendChatsToUser);



export default chatRoutes