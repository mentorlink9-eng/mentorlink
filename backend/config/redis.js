const Redis = require('ioredis');

// Redis connection options
const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  retryDelayOnClusterDown: 100,
  enableOfflineQueue: true,
  connectTimeout: 10000,
  lazyConnect: true,
};

// Create Redis client for general use
const redisClient = new Redis(redisOptions);

// Create separate clients for pub/sub (Socket.IO adapter)
const pubClient = new Redis(redisOptions);
const subClient = new Redis(redisOptions);

// Connection event handlers
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

redisClient.on('close', () => {
  console.warn('Redis connection closed');
});

// Helper functions for common operations
const redisHelpers = {
  // Store online user with TTL
  async setUserOnline(userId, socketId, ttl = 86400) {
    await redisClient.setex(`user:online:${userId}`, ttl, socketId);
    await redisClient.sadd('users:online', userId);
  },

  // Remove user from online set
  async setUserOffline(userId) {
    await redisClient.del(`user:online:${userId}`);
    await redisClient.srem('users:online', userId);
  },

  // Get user's socket ID
  async getUserSocketId(userId) {
    return redisClient.get(`user:online:${userId}`);
  },

  // Check if user is online
  async isUserOnline(userId) {
    return redisClient.sismember('users:online', userId);
  },

  // Get all online users
  async getOnlineUsers() {
    return redisClient.smembers('users:online');
  },

  // Store session data
  async setSession(sessionId, data, ttl = 86400) {
    await redisClient.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
  },

  // Get session data
  async getSession(sessionId) {
    const data = await redisClient.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  // Delete session
  async deleteSession(sessionId) {
    await redisClient.del(`session:${sessionId}`);
  },

  // Rate limiting helper
  async checkRateLimit(key, limit, windowSeconds) {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, windowSeconds);
    }
    return current <= limit;
  },

  // Cache with TTL
  async cache(key, ttl, fetchFn) {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await fetchFn();
    await redisClient.setex(key, ttl, JSON.stringify(data));
    return data;
  },

  // Invalidate cache
  async invalidateCache(pattern) {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  },
};

// Graceful shutdown
const closeRedis = async () => {
  await redisClient.quit();
  await pubClient.quit();
  await subClient.quit();
  console.log('Redis connections closed');
};

module.exports = {
  redisClient,
  pubClient,
  subClient,
  redisHelpers,
  closeRedis,
};
