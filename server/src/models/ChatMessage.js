import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
    },
    model: {
      type: String,
      default: 'llama-3.1-8b-instant',
    },
    meta: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
