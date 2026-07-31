const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

describe('Auth Endpoints', () => {
  let userToken;
  let refreshTokenCookie;
  let testUser = {
    name: 'Test User',
    email: 'testauth@example.com',
    password: 'Password123!'
  };

  it('POST /api/v1/auth/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/register should fail for duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(400); // Or whatever duplicate error returns
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/login should log in the user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    userToken = res.body.data.accessToken;

    // Get refresh token from cookies
    const cookies = res.headers['set-cookie'];
    refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));
    expect(refreshTokenCookie).toBeDefined();
  });

  it('GET /api/v1/auth/me should return current user', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/refresh should refresh the access token', async () => {
    // Assuming refresh expects cookie or body
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', [refreshTokenCookie]);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('POST /api/v1/auth/forgot-password should send a reset link', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testUser.email });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/v1/auth/logout should log out the user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${userToken}`)
      .set('Cookie', [refreshTokenCookie]);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
