const request = require('supertest');
const app = require('../../app');
require('dotenv').config();

describe('Resume Endpoints', () => {
  let userToken;
  let resumeId;
  let testUser = {
    name: 'Resume Tester',
    email: 'resumeauth@example.com',
    password: 'Password123!'
  };

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app).post('/api/v1/auth/login').send({ email: testUser.email, password: testUser.password });
    userToken = res.body.data.accessToken;
  });

  it('POST /api/v1/resumes should create a new resume', async () => {
    const res = await request(app)
      .post('/api/v1/resumes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Software Engineer Resume',
        template: 'modern',
        data: {
          personal: { firstName: 'Resume', lastName: 'Tester' }
        }
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume).toHaveProperty('_id');
    resumeId = res.body.data.resume._id;
  });

  it('GET /api/v1/resumes should fetch all resumes for user', async () => {
    const res = await request(app)
      .get('/api/v1/resumes')
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.resumes)).toBe(true);
    expect(res.body.data.resumes.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/resumes/:id should fetch a specific resume', async () => {
    const res = await request(app)
      .get(`/api/v1/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume._id).toBe(resumeId);
  });

  it('PUT /api/v1/resumes/:id should update a resume', async () => {
    const res = await request(app)
      .put(`/api/v1/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Updated Resume Title'
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe('Updated Resume Title');
  });

  it('POST /api/v1/resumes/:id/duplicate should clone a resume', async () => {
    const res = await request(app)
      .post(`/api/v1/resumes/${resumeId}/duplicate`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.resume.title).toBe('Updated Resume Title (Copy)');
    expect(res.body.data.resume._id).not.toBe(resumeId);
  });

  it('POST /api/v1/resumes/:id/version should save a version snapshot', async () => {
    const res = await request(app)
      .post(`/api/v1/resumes/${resumeId}/version`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('versionNumber');
  });

  it('GET /api/v1/resumes/:id/history should fetch version history', async () => {
    const res = await request(app)
      .get(`/api/v1/resumes/${resumeId}/history`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.history)).toBe(true);
  });

  it('DELETE /api/v1/resumes/:id should delete a resume', async () => {
    const res = await request(app)
      .delete(`/api/v1/resumes/${resumeId}`)
      .set('Authorization', `Bearer ${userToken}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
