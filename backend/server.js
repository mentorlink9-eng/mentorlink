const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { connectDB, disconnectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Optional packages with fallbacks
let helmet, rateLimit, createAdapter, redisConfig;

try {
  helmet = require('helmet');
} catch (e) {
  console.warn('helmet not installed');
}

try {
  rateLimit = require('express-rate-limit');
} catch (e) {
  console.warn('express-rate-limit not installed');
}

// Redis adapter for Socket.IO (optional - for horizontal scaling)
let useRedis = false;
try {
  createAdapter = require('@socket.io/redis-adapter').createAdapter;
  redisConfig = require('./config/redis');
  useRedis = process.env.REDIS_HOST ? true : false;
} catch (e) {
  console.warn('Redis adapter not available. Using in-memory Socket.IO (single instance mode)');
}

// Configuration
const USE_FILE_DB = String(process.env.USE_FILE_DB || 'false').toLowerCase() === 'true';
const PORT = process.env.PORT || 5000;
const FRONTEND_URLS = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

// Track server state
let isReady = false;

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URLS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
});

// In-memory fallback for online users (used when Redis is not available)
const localOnlineUsers = new Map();

// Helper to get/set online users (works with or without Redis)
const onlineUsersHelper = {
  async set(userId, socketId) {
    if (useRedis && redisConfig) {
      await redisConfig.redisHelpers.setUserOnline(userId, socketId);
    } else {
      localOnlineUsers.set(userId, socketId);
    }
  },

  async get(userId) {
    if (useRedis && redisConfig) {
      return await redisConfig.redisHelpers.getUserSocketId(userId);
    }
    return localOnlineUsers.get(userId);
  },

  async delete(userId) {
    if (useRedis && redisConfig) {
      await redisConfig.redisHelpers.setUserOffline(userId);
    } else {
      localOnlineUsers.delete(userId);
    }
  },

  async getAll() {
    if (useRedis && redisConfig) {
      return await redisConfig.redisHelpers.getOnlineUsers();
    }
    return Array.from(localOnlineUsers.keys());
  },
};

// CORS middleware
app.use(cors({
  origin: FRONTEND_URLS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));

// Security middleware
if (helmet) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }));
}

// Rate limiting
if (rateLimit) {
  // Strict limit for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { message: 'Too many authentication attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip,
  });

  // Standard limit for general API
  const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: { message: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict limit for file uploads
  const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { message: 'Too many file uploads. Please wait a moment.' },
  });

  // Apply rate limiting
  app.use('/api/users/login', authLimiter);
  app.use('/api/users/signup', authLimiter);
  app.use('/api/users/verify-otp', authLimiter);
  app.use('/api/users/send-login-otp', authLimiter);
  app.use('/api/users/login-otp', authLimiter);
  app.use('/api/users/upload-profile-picture', uploadLimiter);
  app.use('/api/students/upload-image', uploadLimiter);
  app.use('/api/events/upload-banner', uploadLimiter);
  app.use('/api/', generalLimiter);
}

// Request ID middleware for tracing
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (basic)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' || duration > 1000) {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/organizers', require('./routes/organizerRoutes'));
app.use('/api/events', require('./routes/events'));
app.use('/api/connect', require('./routes/connectionRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MentorLink Backend API',
    version: '1.0.0',
    status: 'running',
  });
});

// Health check endpoints
app.get('/health', async (req, res) => {
  const healthStatus = {
    ok: true,
    ready: isReady,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    redis: useRedis ? 'connected' : 'not configured',
  };

  // Check MongoDB connection
  try {
    const mongoose = require('mongoose');
    healthStatus.mongodb = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch (e) {
    healthStatus.mongodb = 'unknown';
  }

  res.json(healthStatus);
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    ready: isReady,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(`Error [${req.requestId}]:`, err);

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal error occurred'
    : err.message;

  res.status(err.status || 500).json({
    message,
    requestId: req.requestId,
  });
});

// Socket.IO Connection Handling
io.on('connection', async (socket) => {
  console.log('Socket connected:', socket.id);

  // User goes online
  socket.on('user_online', async (userId) => {
    if (!userId) return;

    await onlineUsersHelper.set(userId, socket.id);
    socket.userId = userId;

    console.log(`User ${userId} is online`);

    socket.broadcast.emit('user_status_changed', {
      userId,
      status: 'online',
    });
  });

  // Send message
  socket.on('send_message', async (data) => {
    const { recipientId, message } = data;
    if (!recipientId) return;

    const recipientSocketId = await onlineUsersHelper.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', message);
    }
  });

  // Typing indicators
  socket.on('typing_start', async (data) => {
    const { recipientId, senderId } = data;
    const recipientSocketId = await onlineUsersHelper.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { userId: senderId });
    }
  });

  socket.on('typing_stop', async (data) => {
    const { recipientId, senderId } = data;
    const recipientSocketId = await onlineUsersHelper.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_stopped_typing', { userId: senderId });
    }
  });

  // Message read status
  socket.on('messages_read', async (data) => {
    const { senderId, readBy } = data;
    const senderSocketId = await onlineUsersHelper.get(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit('messages_marked_read', {
        readBy,
        timestamp: new Date(),
      });
    }
  });

  // User disconnects
  socket.on('disconnect', async () => {
    const userId = socket.userId;

    if (userId) {
      await onlineUsersHelper.delete(userId);
      console.log(`User ${userId} is offline`);

      socket.broadcast.emit('user_status_changed', {
        userId,
        status: 'offline',
      });
    }
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('onlineUsers', onlineUsersHelper);

// Server startup
async function start() {
  try {
    // Connect to Redis if available
    if (useRedis && redisConfig) {
      console.log('Connecting to Redis for Socket.IO scaling...');
      io.adapter(createAdapter(redisConfig.pubClient, redisConfig.subClient));
      console.log('Redis adapter connected for Socket.IO');
    }

    // Connect to MongoDB
    if (!USE_FILE_DB) {
      await connectDB();
    }

    isReady = true;

    server.listen(PORT, () => {
      console.log(`
========================================
  MentorLink Backend Server Started
========================================
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Redis: ${useRedis ? 'enabled' : 'disabled'}
  File DB: ${USE_FILE_DB ? 'enabled' : 'disabled'}
  Socket.IO: ready
========================================
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  isReady = false;

  // Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed');

    try {
      // Close Socket.IO
      io.close();
      console.log('Socket.IO closed');

      // Close Redis
      if (useRedis && redisConfig) {
        await redisConfig.closeRedis();
      }

      // Close MongoDB
      await disconnectDB();

      console.log('All connections closed. Exiting...');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force exit after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
start();
