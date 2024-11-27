# **Role-Based Access Control (RBAC) System**

## **Introduction**

This project implements a comprehensive **Role-Based Access Control (RBAC)** system, providing secure and flexible mechanisms for managing user authentication and authorization. The system is designed with scalability and extensibility in mind, ensuring proper access restrictions based on user roles. It leverages modern practices like JWT-based authentication, modular middleware, and dynamic permission checks.

---

## **Core Features**

### **Authentication**
- Secure user login using JSON Web Tokens (JWT).
- Password hashing for enhanced security.
- Stateless authentication, scalable for distributed systems.

### **Authorization**
- Role-based permissions with fine-grained access control.
- Middleware for verifying user roles and resource-specific actions.
- Flexible architecture for defining and managing permissions.

### **Extensible Role Management**
- Easily configurable roles with specific permissions for actions and resources.
- Out-of-the-box support for roles like `ADMIN`, `MODERATOR`, and `USER`.

---

## **Setup Guide**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sbsangu/vrv-security-assignment.git
   cd vrv-security-assignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a .env file in the root directory with the following values:
     ```env
    JWT_SECRET=your_jwt_secret
    PORT=your_desired_port
    MONGO_URI=your_database_uri

     ```

4. **Start the application  in development**:
   ```bash
   npm run dev
   ```

---

## Folder Structure

- **`src/routes`**: Contains route definitions for authentication and user management.
- **`src/controllers`**: Defines logic for handling API requests.
- **`src/services`**: Defines Business logic 
- **`src/repositories`**: Defines database operations
- **`src/middleware`**: Middleware for authentication and authorization.
- **`src/config`**: Configuration for database and environment variables.


### **Routes**

#### **Authentication Routes**
Basic routes for user registration and login:

```typescript
router.post('/register', authController.register);
router.post('/login', authController.login);
```

Full implementation: [`auth.routes.ts`](src/routes/v1/auth.routes.ts).

#### **User Routes**
Examples of secured routes with role-based permissions:

- **ADMIN Access And MODERATOR access**:
  ```typescript
  router.get(
    '/',
    authMiddleware.authenticate,
    authMiddleware.authorize('read', 'users', ['ADMIN',"MODERATOR"]),
    userController.getAllUsers
  );
  ```

 - **Accessible to USERS**:
  ```typescript
  router.put(
    '/profile',
    authMiddleware.authenticate,
    authMiddleware.authorize('update','profile',['USER']),
    userController.updateUserProfile
  );
  ```


Full implementation: [`user.routes.ts`](src/routes/v1/user.routes.ts).

---

## **Middlewares**

### **Authentication Middleware**
The `AuthMiddleware` ensures secure handling of JWT tokens and permissions. 

For the full implementation, see [`auth.middleware.ts`](src/middleware/auth.middleware.ts).

---

## **API Endpoints**

### **Authentication**
| Endpoint     | Method | Description        |
|--------------|--------|--------------------|
| `auth/register`  | POST   | Register a new user|
| `auth/login`     | POST   | Login and get a JWT|

### **User Management**
| Endpoint         | Method | Description                        | Role Required |
|------------------|--------|------------------------------------|---------------|
|    `users/`      | GET    | Fetch all users                   | Admin, Moderator |
|  `users/profile` | GET    | Fetch the current user’s profile  |User/Admin/Moderator|
|  `users/profile` | PUT    | Update the current user’s profile | User           |
|    `users/:id`   | DELETE |   Delete the user profile         | Admin          |
---

## **Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **Authentication**: JSON Web Tokens (JWT)
- **Authorization**: Modular, dynamic role-based authorization


---

## **Testing the API**

- Use tools like Postman or cURL to interact with the endpoints.
- Test with and without valid JWT tokens to verify access restrictions.
- Simulate requests for different roles (ADMIN, MODERATOR, USER) to ensure proper authorization enforcement.

---

