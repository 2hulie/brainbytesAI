const request = require('supertest');
const app = require('../app'); // Make sure this points to your Express app instance

describe('API Tests', () => {
  it('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');

    console.log('API Tests started');
    console.log('GET /api/health endpoint tested');
    console.log('Response status code:', res.statusCode);
    console.log('Response body:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('OK');
  });
});
