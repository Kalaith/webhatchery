# API Endpoints for Authentication

This document outlines the API endpoints related to authentication in the backend of the SES application. It includes details on user registration, login, logout, and profile management, along with the required request formats and expected responses.

## Base URL

All endpoints are prefixed with the base URL:

```
https://your-api-domain.com/api/v1
```

## Endpoints

### 1. User Registration

- **Endpoint:** `/auth/register`
- **Method:** POST
- **Description:** Registers a new user in the system.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```
- **Responses:**
  - **201 Created**
    ```json
    {
      "message": "User registered successfully.",
      "userId": "12345"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Email already in use."
    }
    ```

### 2. User Login

- **Endpoint:** `/auth/login`
- **Method:** POST
- **Description:** Authenticates a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "token": "your.jwt.token",
      "user": {
        "id": "12345",
        "email": "user@example.com",
        "name": "John Doe"
      }
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "Invalid credentials."
    }
    ```

### 3. User Logout

- **Endpoint:** `/auth/logout`
- **Method:** POST
- **Description:** Logs out the user by invalidating the JWT token.
- **Responses:**
  - **204 No Content**
  - **401 Unauthorized**
    ```json
    {
      "error": "User not authenticated."
    }
    ```

### 4. Get User Profile

- **Endpoint:** `/auth/profile`
- **Method:** GET
- **Description:** Retrieves the authenticated user's profile information.
- **Headers:**
  - `Authorization: Bearer your.jwt.token`
- **Responses:**
  - **200 OK**
    ```json
    {
      "id": "12345",
      "email": "user@example.com",
      "name": "John Doe"
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "User not authenticated."
    }
    ```

### 5. Update User Profile

- **Endpoint:** `/auth/profile`
- **Method:** PUT
- **Description:** Updates the authenticated user's profile information.
- **Headers:**
  - `Authorization: Bearer your.jwt.token`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe"
  }
  ```
- **Responses:**
  - **200 OK**
    ```json
    {
      "message": "Profile updated successfully."
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "User not authenticated."
    }
    ```

## Security Considerations

- All endpoints require authentication via JWT tokens.
- Ensure to validate and sanitize all inputs to prevent security vulnerabilities.
- Use HTTPS for all communications to protect sensitive data.