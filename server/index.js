import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRoute from './routes/generate.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'PrepAI Backend',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api', generateRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PrepAI backend listening on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log(`ℹ️  Note: GEMINI_API_KEY not configured. Running in dynamic fallback study-set mode for testing.`);
  } else {
    console.log(`🔑 Gemini API Key detected and active.`);
  }
});
