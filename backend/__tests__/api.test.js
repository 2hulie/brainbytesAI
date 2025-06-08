const request = require('supertest');
const app = require('../server'); // import the app

describe('API Health Check', () => {
  test('GET / returns welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Welcome to the BrainBytes API');
  });

  test('GET /api/protected without token returns 401', async () => {
    const response = await request(app).get('/api/protected');
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });
});