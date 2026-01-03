const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`User service listening on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});