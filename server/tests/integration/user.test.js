const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

describe('User Endpoints', () => {
  let userToken;
  let testUser = {
    name: 'User Tester',
    email: 'userauth@example.com',
    password: 'Password123!'
  };

  beforeAll(async () => {
    // Register and login to get token
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
    userToken = res.body.data.accessToken;
  });

  it('GET /api/v1/users/me should fetch the user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe(testUser.name);
  });

  it('PUT /api/v1/users/updatedetails should update user details', async () => {
    const res = await request(app)
      .put('/api/v1/users/updatedetails')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Updated Name',
        college: 'Test University'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.name).toBe('Updated Name');
    expect(res.body.data.user.college).toBe('Test University');
  });

  it('PUT /api/v1/users/profile-photo should update profile photo URL', async () => {
    const res = await request(app)
      .put('/api/v1/users/profile-photo')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        profilePhoto: 'https://example.com/newphoto.jpg'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.profilePhoto).toBe('https://example.com/newphoto.jpg');
  });

  it('DELETE /api/v1/users/me should soft delete the user', async () => {
    const res = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    // Verify user is no longer accessible
    const fetchRes = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(fetchRes.statusCode).not.toEqual(200);
  });
});
