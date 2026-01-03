const request = require('supertest');
const createApp = require('./index');

describe('User Service', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('Health Endpoints', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('user-service');
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /ready should return ready status', async () => {
      const response = await request(app).get('/ready');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ready');
      expect(response.body.service).toBe('user-service');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return service information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.service).toBe('user-service');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.description).toContain('User management');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('User API Endpoints', () => {
    test('GET /api/users should return list of users', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.total).toBe(3);
      expect(response.body.service).toBe('user-service');
    });

    test('GET /api/users/:id should return specific user', async () => {
      const response = await request(app).get('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    test('GET /api/users/:id should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    test('POST /api/users should create new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body.role).toBe(newUser.role);
      expect(response.body.id).toBeDefined();
    });

    test('POST /api/users should default role to user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body.role).toBe('user');
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
});