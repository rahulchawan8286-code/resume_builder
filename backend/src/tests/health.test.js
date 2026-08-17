const request = require('supertest');
const app = require('../app');

describe('Health API', () => {
  it('should return 200 and connected status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('OK');
    expect(res.body.database).toBe('Connected');
  });
});
