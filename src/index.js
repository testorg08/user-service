const express = require('express');

function createApp() {
  const app = express();

  // Middleware
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

  app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
    ];
    
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.post('/api/users', (req, res) => {
    const { name, email, role } = req.body;
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: role || 'user'
    };
    res.status(201).json(newUser);
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

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  return app;
}

// Export the app for testing
module.exports = createApp;

// Start server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  const app = createApp();
  
  app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}