const crypto = require('crypto');

/**
 * Simple In-Memory Cache for AI API responses to reduce costs and latency.
 * In a production environment with multiple instances, this should be replaced by Redis.
 */
class Cache {
  constructor(ttlSeconds = 3600) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }

  _generateKey(prompt, model) {
    return crypto.createHash('sha256').update(`${model}:${prompt}`).digest('hex');
  }

  get(prompt, model) {
    const key = this._generateKey(prompt, model);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(prompt, model, value) {
    const key = this._generateKey(prompt, model);
    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }
}

module.exports = new Cache();
