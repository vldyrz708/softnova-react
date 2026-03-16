/**
 * JWT configuration and signing utility.
 * Single source of truth for all token-related constants.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_prod';

/** Session lifetime in milliseconds (default 1 hour) */
const SESSION_TTL_MS = parseInt(process.env.SESSION_TTL_MS || String(60 * 60 * 1000), 10);

/** Session lifetime in seconds — used as JWT expiresIn value */
const SESSION_TTL_SECONDS = Math.max(1, Math.floor(SESSION_TTL_MS / 1000));

const COOKIE_NAME = 'token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: SESSION_TTL_MS,
};

/**
 * Sign a JWT token with the app secret.
 * @param {object} payload — data to encode
 * @returns {string} signed token
 */
const sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_TTL_SECONDS });

module.exports = { JWT_SECRET, SESSION_TTL_SECONDS, COOKIE_NAME, COOKIE_OPTIONS, sign };
