/**
 * Security Utilities for MentorLink
 * Input sanitization, password validation, and security helpers
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Try to load DOMPurify for XSS sanitization
let DOMPurify;
try {
  const { JSDOM } = require('jsdom');
  const createDOMPurify = require('dompurify');
  const window = new JSDOM('').window;
  DOMPurify = createDOMPurify(window);
} catch (e) {
  console.warn('DOMPurify not available. Using basic sanitization.');
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeHtml = (input) => {
  if (typeof input !== 'string') return input;

  if (DOMPurify) {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      ALLOWED_ATTR: [],
    });
  }

  // Fallback: Basic HTML entity encoding
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize object properties recursively
 * @param {Object} obj - Object to sanitize
 * @param {Array} fieldsToSanitize - Specific fields to sanitize (default: all string fields)
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj, fieldsToSanitize = null) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        // Sanitize if no specific fields specified, or if this field is in the list
        if (!fieldsToSanitize || fieldsToSanitize.includes(key)) {
          sanitized[key] = sanitizeHtml(value);
        } else {
          sanitized[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value, fieldsToSanitize);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

/**
 * Sanitize input middleware
 * @param {Array} fieldsToSanitize - Specific fields to sanitize
 */
const sanitizeInput = (fieldsToSanitize = ['name', 'bio', 'about', 'content', 'message', 'notes', 'description', 'feedback']) => {
  return (req, res, next) => {
    if (req.body) {
      req.body = sanitizeObject(req.body, fieldsToSanitize);
    }
    if (req.query) {
      req.query = sanitizeObject(req.query, fieldsToSanitize);
    }
    next();
  };
};

/**
 * Password strength validation rules
 */
const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters`);
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    errors.push(`Password must be less than ${PASSWORD_RULES.maxLength} characters`);
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_RULES.requireSpecial) {
    const specialRegex = new RegExp(`[${PASSWORD_RULES.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
    if (!specialRegex.test(password)) {
      errors.push('Password must contain at least one special character');
    }
  }

  // Check for common weak patterns
  const commonPatterns = [
    /^123456/,
    /password/i,
    /qwerty/i,
    /abcdef/i,
    /(.)\1{3,}/, // Same character 4+ times
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Password is too common or contains weak patterns');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Generate cryptographically secure OTP
 * @param {number} length - OTP length (default: 6)
 * @returns {string} - Numeric OTP
 */
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
};

/**
 * Hash OTP before storage
 * @param {string} otp - Plain text OTP
 * @returns {Promise<string>} - Hashed OTP
 */
const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(8); // Lower rounds for faster verification
  return bcrypt.hash(otp, salt);
};

/**
 * Verify OTP against hash
 * @param {string} otp - Plain text OTP
 * @param {string} hashedOtp - Hashed OTP from database
 * @returns {Promise<boolean>} - Whether OTP matches
 */
const verifyOTP = async (otp, hashedOtp) => {
  if (!otp || !hashedOtp) return false;
  return bcrypt.compare(otp, hashedOtp);
};

/**
 * Generate secure random token
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {string} - Hex-encoded token
 */
const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash sensitive data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hex-encoded hash
 */
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Constant-time string comparison (prevents timing attacks)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - Whether strings are equal
 */
const secureCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // Still do comparison to maintain constant time
    crypto.timingSafeEqual(bufA, Buffer.alloc(bufA.length));
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 254;
};

/**
 * Rate limiting helper using sliding window
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} key - Unique identifier (e.g., IP or user ID)
   * @param {number} limit - Max requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} - { allowed: boolean, remaining: number, resetIn: number }
   */
  check(key, limit, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or initialize request log
    let requestLog = this.requests.get(key) || [];

    // Filter out old requests
    requestLog = requestLog.filter(timestamp => timestamp > windowStart);

    const remaining = Math.max(0, limit - requestLog.length);
    const allowed = remaining > 0;

    if (allowed) {
      requestLog.push(now);
      this.requests.set(key, requestLog);
    }

    // Calculate reset time
    const oldestRequest = requestLog[0] || now;
    const resetIn = Math.max(0, windowMs - (now - oldestRequest));

    return { allowed, remaining, resetIn };
  }

  /**
   * Clean up old entries (call periodically)
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, timestamps] of this.requests.entries()) {
      const recentTimestamps = timestamps.filter(t => now - t < maxAge);
      if (recentTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentTimestamps);
      }
    }
  }
}

// Singleton rate limiter instance
const rateLimiter = new RateLimiter();

// Clean up every hour
setInterval(() => rateLimiter.cleanup(), 60 * 60 * 1000);

module.exports = {
  sanitizeHtml,
  sanitizeObject,
  sanitizeInput,
  validatePassword,
  PASSWORD_RULES,
  generateOTP,
  hashOTP,
  verifyOTP,
  generateSecureToken,
  hashData,
  secureCompare,
  isValidEmail,
  rateLimiter,
  RateLimiter,
};
