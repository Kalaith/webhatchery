# API Integration for Auth0 in the Frontend

This document outlines how the frontend application will communicate with the backend API for authentication purposes using Auth0. It details the API endpoints used for login, logout, and user profile retrieval, along with example requests and responses.

## API Endpoints

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Description:** This endpoint is used to log in a user. It accepts the user's credentials and returns a JWT token upon successful authentication.

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 2. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** This endpoint is used to log out a user. It invalidates the user's session on the server.

**Request Example:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response Example:**
```json
{
  "message": "Logout successful"
}
```

### 3. Retrieve User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** This endpoint retrieves the authenticated user's profile information. It requires a valid JWT token in the Authorization header.

**Request Example:**
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Example:**
```json
{
  "id": "12345",
  "email": "user@example.com",
  "name": "John Doe",
  "roles": ["user", "admin"]
}
```

## Integration Steps

1. **Install Axios**: Use Axios for making API requests.
   ```bash
   npm install axios
   ```

2. **Create API Client**: Set up a centralized API client to handle requests.
   ```typescript
   // src/api/api.ts
   import axios from 'axios';

   const apiClient = axios.create({
     baseURL: 'https://your-backend-url.com/api',
     headers: {
       'Content-Type': 'application/json',
     },
   });

   export default apiClient;
   ```

3. **Implement Login Function**:
   ```typescript
   import apiClient from './api';

   export const login = async (email: string, password: string) => {
     const response = await apiClient.post('/auth/login', { email, password });
     return response.data;
   };
   ```

4. **Implement Logout Function**:
   ```typescript
   export const logout = async (token: string) => {
     const response = await apiClient.post('/auth/logout', { token });
     return response.data;
   };
   ```

5. **Implement Profile Retrieval Function**:
   ```typescript
   export const getProfile = async (token: string) => {
     const response = await apiClient.get('/auth/profile', {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });
     return response.data;
   };
   ```

## Conclusion

This document provides a comprehensive overview of how the frontend application will interact with the backend API for authentication using Auth0. By following the outlined steps and examples, developers can effectively implement the login system and manage user sessions within the application.