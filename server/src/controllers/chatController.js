import axios from 'axios';
import { Conversation } from '../models/Conversation.js';
import { ChatMessage } from '../models/ChatMessage.js';

const SYSTEM_PROMPT = `You are Replate AI, a world-class Food Rescue, Safety, and Redistribution Assistant powering the Replate platform.

Your mission is to eliminate food waste and hunger by guiding food donors (restaurants, hotels, caterers, grocery stores, bakeries, households) and food recipients (NGOs, shelters, soup kitchens, community volunteers).

Your core domains of expertise include:
1. 🛡️ Food Safety & Hygiene Standards:
   - Hazard analysis, danger zone temperatures (between 4°C/40°F and 60°C/140°F).
   - Maximum holding time for cooked foods (2-hour/4-hour rule).
   - Cross-contamination prevention, allergen separation, and sanitized packaging.
2. ⏱️ Shelf-Life & Expiration Estimation:
   - Accurate safe consumption windows for cooked curries, rice, pasta, meats, baked goods, fresh fruits, vegetables, and dairy.
   - Storage instructions (refrigeration at 0-4°C, freezing at -18°C, hot insulated containers).
3. 🍲 Creative Culinary Upcycling:
   - Practical, gourmet recipes to repurpose surplus ingredients into stews, stocks, casseroles, baked treats, preserves, and smoothies.
4. 🚚 Donation Logistics & Packaging:
   - How to pack, label (contents, prep time, allergens), transport, and deliver food to shelters without compromising safety.
5. 📊 Environmental Impact:
   - Explaining how 1 meal rescued saves approximately 2.5 kg of CO2 equivalent emissions and conserves fresh water.

Formatting guidelines:
- Use clean Markdown: clear bold headings, concise bullet points, and emoji indicators.
- Include temperatures in both Celsius and Fahrenheit.
- Always err on the side of consumer safety. If food exhibits signs of spoilage (off-odors, sliminess, mold), advise proper composting rather than donation.
- Be compassionate, encouraging, and actionable.`;

// @desc    Send message to Groq AI & persist conversation
// @route   POST /api/chat/message
// @access  Public / Optional Auth
export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId, sessionId } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty',
      });
    }

    let conversation;

    // Retrieve or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      const generatedTitle =
        message.length > 40 ? `${message.substring(0, 40).trim()}...` : message.trim();

      conversation = await Conversation.create({
        user: userId,
        sessionId: sessionId || '',
        title: generatedTitle,
        lastMessage: message,
        lastMessageAt: new Date(),
      });
    }

    // Save user message to database
    await ChatMessage.create({
      conversation: conversation._id,
      user: userId,
      role: 'user',
      content: message.trim(),
    });

    // Retrieve previous messages for context (last 10 messages)
    const history = await ChatMessage.find({ conversation: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
    ];

    const apiKey = process.env.GROQ_API_KEY;
    const requestedModel = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
    const fallbackModels = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

    let aiReply = '';
    let usedModel = requestedModel;
    let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    if (!apiKey) {
      aiReply =
        "Groq API Key is not configured on the server. Please check your .env configuration. In the meantime, remember the golden rule of food safety: Keep hot foods hot (>60°C/140°F) and cold foods cold (<4°C/40°F)!";
    } else {
      const callGroq = async (modelName) => {
        return await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: modelName,
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 0.9,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            timeout: 30000,
          }
        );
      };

      try {
        let groqResponse;
        try {
          groqResponse = await callGroq(requestedModel);
          usedModel = requestedModel;
        } catch (initialErr) {
          if (
            initialErr.response?.data?.error?.code === 'model_not_found' ||
            initialErr.response?.status === 404
          ) {
            console.warn(`Model ${requestedModel} not found on Groq, trying fallback: ${fallbackModels[0]}`);
            groqResponse = await callGroq(fallbackModels[0]);
            usedModel = fallbackModels[0];
          } else {
            throw initialErr;
          }
        }

        if (
          groqResponse.data &&
          groqResponse.data.choices &&
          groqResponse.data.choices.length > 0
        ) {
          aiReply = groqResponse.data.choices[0].message.content;
          if (groqResponse.data.usage) {
            usage = groqResponse.data.usage;
          }
        } else {
          aiReply = 'Unable to generate response from Groq AI. Please try again.';
        }
      } catch (apiError) {
        console.error('Groq API Error:', apiError.response?.data || apiError.message);
        const errMsg = apiError.response?.data?.error?.message || apiError.message;
        aiReply = `⚠️ Replate AI Notice: Groq API responded with: "${errMsg}". Please check your network or API credits.`;
      }
    }

    // Save assistant reply to database
    const assistantMessage = await ChatMessage.create({
      conversation: conversation._id,
      user: userId,
      role: 'assistant',
      content: aiReply,
      model: usedModel,
      meta: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      },
    });

    // Update conversation last message
    conversation.lastMessage = aiReply.substring(0, 80);
    conversation.lastMessageAt = new Date();
    await conversation.save();

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      message: assistantMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's conversations
// @route   GET /api/chat/conversations
// @access  Public (matches user or session)
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { sessionId } = req.query;

    let query = {};
    if (userId) {
      query = { user: userId };
    } else if (sessionId) {
      query = { sessionId: sessionId };
    } else {
      return res.status(200).json({ success: true, conversations: [] });
    }

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/chat/conversations/:id
// @access  Public
export const getConversationMessages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    const messages = await ChatMessage.find({ conversation: id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation and its messages
// @route   DELETE /api/chat/conversations/:id
// @access  Public / Private
export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;

    await ChatMessage.deleteMany({ conversation: id });
    await Conversation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all conversations for current user
// @route   DELETE /api/chat/clear
// @access  Private
export const clearAllConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userConversations = await Conversation.find({ user: userId });
    const convIds = userConversations.map((c) => c._id);

    await ChatMessage.deleteMany({ conversation: { $in: convIds } });
    await Conversation.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: 'All conversation histories cleared',
    });
  } catch (error) {
    next(error);
  }
};
