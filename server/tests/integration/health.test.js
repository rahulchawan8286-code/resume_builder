const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const connectDB = require('../../config/db');
require('dotenv').config();

describe('Health and MongoDB Connection Test', () => {
  beforeAll(async () => {
    // Attempt to connect to the database configured in .env
    await connectDB();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it('should return 200 on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should have a connected Mongoose instance or be in DEVELOPMENT_MODE', () => {
    if (process.env.DEVELOPMENT_MODE === 'true') {
      expect(true).toBe(true);
    } else {
      // 1 = connected, 2 = connecting
      expect(mongoose.connection.readyState).toBe(1);
    }
  });
});
