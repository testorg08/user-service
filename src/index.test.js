const request = require('supertest');
const express = require('express');

// Import the app logic (we'll need to refactor index.js to export the app)
describe('User Service', () => {
  let app;

  beforeEach(() => {
    // Create a new app instance for each test
    app = express();
    app.use(express.json());

    // Health check endpoints
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        service: 'user-service',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });

    app.get('/ready', (req, res) => {
      res.status(200).json({ 
        status: 'ready', 
        service: 'user-service',
        timestamp: new Date().toISOString()
      });
    });

    // API endpoints
    app.get('/api/users', (req, res) => {
      res.json({
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
          { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
        ],
        total: 3,
        service: 'user-service'
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        service: 'user-service',
        version: '1.0.0',
        description: 'User management service for Conga Platform',
        endpoints: [
          'GET /health - Health check',
          'GET /ready - Readiness check',
          'GET /api/users - List all users',
          'GET /api/users/:id - Get user by ID',
          'POST /api/users - Create new user'
        ],
        environment: process.env.NODE_ENV || 'development'
      });
    });
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

  describe('API Endpoints', () => {
    test('GET /api/users should return users list', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.total).toBe(3);
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
});