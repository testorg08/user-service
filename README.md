# Conga User Management Service

[![Build Status](https://github.com/testorg08/user-service/workflows/CI/badge.svg)](https://github.com/testorg08/user-service/actions)

User profiles, preferences, and management service for the Conga Platform.

## 🏗️ Architecture

- **Site Group**: CSG1 (Platform Layer)
- **Sync Wave**: 2 (Depends on SSG1 services)
- **Dependencies**: auth-service, config-service
- **Infrastructure**: PostgreSQL, Redis, S3

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List users |
| GET | `/api/v1/users/{id}/profile` | Get user profile |
| PUT | `/api/v1/users/{id}/profile` | Update user profile |
| GET | `/api/v1/users/{id}/preferences` | Get user preferences |
| PUT | `/api/v1/users/{id}/preferences` | Update user preferences |

## 🌍 Environments

- **Development**: https://users-dev.conga.com
- **Staging**: https://users-staging.conga.com  
- **Production**: https://users.conga.com

**Part of the Conga Platform** | **Site Group CSG1** | **Sync Wave 2**