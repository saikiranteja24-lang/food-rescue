import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid local port mismatch issues
    },
    credentials: true,
  })
);

// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Replate Food Rescue & AI Chatbot API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/donations', donationRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #059669;">🌱 Replate Backend Service is Running</h1>
      <p>Digital Platform for Leftover Food Collection and Redistribution with Groq AI.</p>
      <p><a href="/api/health" style="color: #10b981; font-weight: bold;">Check Health Status</a></p>
    </div>
  `);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 ========================================================
  🌱 Replate Backend Server Running in ${process.env.NODE_ENV || 'development'} mode
  📡 Listening on: http://localhost:${PORT}
  🤖 Groq AI Model: ${process.env.GROQ_MODEL || 'llama-3.1-8b-instant'}
  🛡️ Health Check: http://localhost:${PORT}/api/health
  ========================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Keep server alive in dev
});
