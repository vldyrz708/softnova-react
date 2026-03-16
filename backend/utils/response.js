/**
 * Standardised HTTP response helpers.
 * Keeps controllers thin — always respond via these helpers.
 */

/** Send a successful JSON response */
const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, ...data });

/** Send an error JSON response */
const fail = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

module.exports = { ok, fail };
