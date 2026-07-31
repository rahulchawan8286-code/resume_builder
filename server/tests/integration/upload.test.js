const request = require('supertest');
const app = require('../../app');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

describe('Upload Endpoints', () => {
  let userToken;
  let testUser = {
    name: 'Upload Tester',
    email: 'uploadauth@example.com',
    password: 'Password123!'
  };

  // Create a dummy file for upload testing
  const dummyFilePath = path.join(__dirname, 'dummy.jpg');

  beforeAll(async () => {
    fs.writeFileSync(dummyFilePath, 'dummy content');
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
    userToken = res.body.data.accessToken;
  });

  afterAll(() => {
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  });

  it('POST /api/v1/upload/profile-photo should upload a photo and return url', async () => {
    const res = await request(app)
      .post('/api/v1/upload/profile-photo')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('photo', dummyFilePath); // Using supertest's attach for multipart/form-data
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('url');
  });
});
