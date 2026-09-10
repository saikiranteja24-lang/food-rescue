import express from 'express';
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  deleteConversation,
  clearAllConversations,
} from '../controllers/chatController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { aiChatLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/message', aiChatLimiter, optionalAuth, sendMessage);
router.get('/conversations', optionalAuth, getConversations);
router.get('/conversations/:id', getConversationMessages);
router.delete('/conversations/:id', deleteConversation);
router.delete('/clear', protect, clearAllConversations);

export default router;
