const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

describe('AI Endpoints', () => {
  let userToken;
  let testUser = {
    name: 'AI Tester',
    email: 'aiauth@example.com',
    password: 'Password123!'
  };

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
    userToken = res.body.data.accessToken;
  });

  it('POST /api/v1/ai/summary should return a generated summary', async () => {
    const res = await request(app)
      .post('/api/v1/ai/summary')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        resumeId: 'mock-resume-id',
        resumeData: {
          title: 'Test Resume',
          experience: [{ role: 'Developer' }]
        }
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('summary');
  });

  it('POST /api/v1/ai/ats should return ATS score', async () => {
    const res = await request(app)
      .post('/api/v1/ai/ats')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        resumeId: 'mock-resume-id',
        resumeText: 'I am a developer. I have written this long text to pass the validation because it requires at least 50 characters to proceed with the analysis.',
        jobDescription: 'Looking for a developer with Node.js experience.'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.analysis).toHaveProperty('score');
  });

  it('GET /api/v1/ai/history should return AI prompt history', async () => {
    const res = await request(app)
      .get('/api/v1/ai/history')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.history)).toBe(true);
  });
});
