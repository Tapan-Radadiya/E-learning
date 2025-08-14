# E-Learning Platform API Documentation

A microservices-based e-learning platform with authentication, course management, enrollment, progress tracking, and gamification features.

## Architecture Overview

The platform consists of 5 microservices:
- **Auth Service** (Node.js/TypeScript) - User authentication and profile management
- **Course Service** (Node.js/TypeScript) - Course and module management
- **Enrollment & Progress Service** (Node.js/TypeScript) - User enrollment and progress tracking
- **Progression Service** (Go) - XP system and leaderboard with real-time updates
- **Shared Package** (Node.js/TypeScript) - Common middleware and utilities

---

## 🔐 Auth Service

**Base URL:** `/user`

### 1. Create User
- **Endpoint:** `POST /user/add-user`
- **Description:** Register a new user
- **Request Body:**
```json
{
  "display_name": "string (1-50 chars)",
  "email": "string (valid email)",
  "password": "string (8-50 chars)",
  "role": "ADMIN" | "USER"
}
```
- **Response:** `201 Created`
```json
{
  "message": "User Created Successfully",
  "data": { /* user data */ }
}
```

### 2. Login User
- **Endpoint:** `POST /user/login`
- **Description:** Authenticate user and get access token
- **Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string"
}
```
- **Response:** `200 OK`
```json
{
  "message": "Login successful",
  "data": "access_token_string"
}
```
- **Note:** Sets httpOnly cookie with refresh token

### 3. Refresh Token
- **Endpoint:** `GET /user/refresh`
- **Description:** Get new access token using refresh token
- **Headers:** Cookie with jwt refresh token
- **Response:** `200 OK`
```json
{
  "message": "Token refreshed",
  "data": "new_access_token"
}
```

### 4. Get User Profile
- **Endpoint:** `GET /user/get-profile`
- **Description:** Get current user's profile
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** `200 OK`
```json
{
  "message": "Profile fetched",
  "data": { /* user profile data */ }
}
```

---

## 📚 Course Service

**Base URL:** `/course` and `/course-module`

### Course Management

### 1. Create Course
- **Endpoint:** `POST /course/create-course`
- **Description:** Create a new course (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "duration": "number",
  /* other course fields */
}
```
- **Response:** `201 Created`

### 2. Get Course Details
- **Endpoint:** `GET /course/course/:courseId`
- **Description:** Get specific course details
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `courseId` (path): Course UUID
- **Response:** `200 OK`

### 3. Update Course
- **Endpoint:** `PUT /course/update-course/:courseId`
- **Description:** Update course details (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `courseId` (path): Course UUID
- **Request Body:** Course update data
- **Response:** `200 OK`

### 4. Delete Course
- **Endpoint:** `DELETE /course/delete-course/:courseId`
- **Description:** Delete a course (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `courseId` (path): Course UUID
- **Response:** `200 OK`

### Course Module Management

### 5. Add Course Module
- **Endpoint:** `POST /course-module/add-module/:courseId`
- **Description:** Add module to course (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `courseId` (path): Course UUID
- **Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "order": "number",
  /* other module fields */
}
```
- **Response:** `201 Created`

### 6. Get All Course Modules
- **Endpoint:** `GET /course-module/get-all-modules/:courseId`
- **Description:** Get all modules for a course
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `courseId` (path): Course UUID
- **Response:** `200 OK`

### 7. Update Module
- **Endpoint:** `PUT /course-module/update-modules/:moduleId`
- **Description:** Update course module (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `moduleId` (path): Module UUID
- **Request Body:** Module update data
- **Response:** `200 OK`

### 8. Remove Module
- **Endpoint:** `DELETE /course-module/remove-module/:moduleId`
- **Description:** Remove course module (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `moduleId` (path): Module UUID
- **Response:** `200 OK`

### 9. Get Module Details
- **Endpoint:** `GET /course-module/get-module-details/:moduleId`
- **Description:** Get specific module details
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `moduleId` (path): Module UUID
- **Response:** `200 OK`

---

## 📝 Enrollment & Progress Service

**Base URL:** `/enroll` and `/course-progress`

### Enrollment Management

### 1. Enroll User in Course
- **Endpoint:** `POST /enroll/enroll-user/:courseId`
- **Description:** Enroll current user in a course
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `courseId` (path): Course UUID
- **Response:** `201 Created`
```json
{
  "message": "User enrolled successfully",
  "data": { /* enrollment data */ }
}
```

### 2. Get Course Enrollment Data
- **Endpoint:** `GET /enroll/course-enrollment-data/:courseId`
- **Description:** Get all users enrolled in a course (Admin only)
- **Headers:** `Authorization: Bearer <access_token>`
- **Role Required:** ADMIN
- **Parameters:**
  - `courseId` (path): Course UUID
- **Response:** `200 OK`
```json
{
  "message": "Data",
  "data": [ /* array of enrolled users */ ]
}
```

### Progress Tracking

### 3. Update User Progress
- **Endpoint:** `PATCH /course-progress/upgrade-progress/:moduleId`
- **Description:** Mark module as completed and update progress
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `moduleId` (path): Module UUID
- **Response:** `200 OK`
```json
{
  "message": "Progress updated",
  "data": { /* progress data */ }
}
```

---

## 🏆 Progression Service (Go)

**Base URL:** `/user-xp-events` and `/xpevents`

### XP Management

### 1. Trigger XP Event
- **Endpoint:** `POST /user-xp-events/trigger-xp`
- **Description:** Award XP points to user for completing actions
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**
```json
{
  "xpevent": "string (event name)",
  "userid": "uuid"
}
```
- **Response:** `200 OK`
```json
{
  "message": "Data fetched",
  "data": {
    "id": "uuid",
    "xp_point": 150,
    "userid": "uuid",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```

### 2. Get User XP Data
- **Endpoint:** `GET /user-xp-events/user-xp-data/:userId`
- **Description:** Get XP data for specific user
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `userId` (path): User UUID
- **Response:** `200 OK`
```json
{
  "message": "UserXp Data Fetched",
  "data": {
    "id": "uuid",
    "xp_point": 150,
    "userid": "uuid",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```

### 3. Get Leaderboard (SSE)
- **Endpoint:** `GET /user-xp-events/leaderboard`
- **Description:** Real-time leaderboard using Server-Sent Events
- **Headers:** `Authorization: Bearer <access_token>`
- **Response:** `200 OK` (SSE Stream)
```
data: [
  {
    "UserId": "uuid",
    "DisplayName": "string",
    "Email": "string",
    "XpPoints": 150
  }
]
```
- **Note:** Streams real-time updates when XP changes occur

### XP Events Management

### 4. Create XP Event
- **Endpoint:** `POST /xpevents/create-event`
- **Description:** Create new XP event type
- **Headers:** `Authorization: Bearer <access_token>`
- **Request Body:**
```json
{
  "xpevent": "string (unique event name)",
  "xppoints": 25
}
```
- **Response:** `201 Created`
```json
{
  "message": "Event Created",
  "data": {
    "id": "uuid",
    "xpevent": "string",
    "xppoints": 25,
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```

### 5. Get Event Details
- **Endpoint:** `GET /xpevents/:eventId`
- **Description:** Get specific XP event details
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `eventId` (path): Event UUID
- **Response:** `200 OK`
```json
{
  "message": "Data fetched",
  "data": { /* event details */ }
}
```

### 6. Update XP Event
- **Endpoint:** `PUT /xpevents/update-event/:eventId`
- **Description:** Update XP event details
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `eventId` (path): Event UUID
- **Request Body:**
```json
{
  "xpevent": "string",
  "xppoints": 30
}
```
- **Response:** `200 OK`
```json
{
  "message": "Event Updated",
  "data": { /* updated event data */ }
}
```

### 7. Delete XP Event
- **Endpoint:** `DELETE /xpevents/:eventId`
- **Description:** Remove XP event
- **Headers:** `Authorization: Bearer <access_token>`
- **Parameters:**
  - `eventId` (path): Event UUID
- **Response:** `200 OK`
```json
{
  "message": "Event Removed",
  "data": { /* removed event data */ }
}
```

---

## 🔒 Authentication & Authorization

### Authentication
- Most endpoints require `Authorization: Bearer <access_token>` header
- Access tokens are obtained via login endpoint
- Refresh tokens are stored as httpOnly cookies

### Authorization Roles
- **USER**: Can access courses, enroll, track progress, view XP
- **ADMIN**: All USER permissions + course/module management + enrollment analytics

### Error Responses
All services return consistent error format:
```json
{
  "message": "Error description",
  "error": "Detailed error info (optional)"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

---

## 🚀 Getting Started

1. **Setup Environment**: Configure `.env` files for each service
2. **Database**: Run migrations for each service
3. **Start Services**: Launch all microservices
4. **Authentication**: Create admin user and obtain access token
5. **Create Content**: Use admin endpoints to create courses and modules
6. **User Flow**: Users can register, enroll, complete modules, and earn XP

## 📊 Real-time Features

- **Leaderboard SSE**: Real-time leaderboard updates via Server-Sent Events
- **Progress Tracking**: Automatic XP awarding on module completion
- **Live Rankings**: Instant leaderboard updates when users earn XP

## 🔄 Service Communication

- **gRPC**: Inter-service communication for user profiles and course data
- **Database**: Each service has its own database
- **Shared Package**: Common middleware and utilities across Node.js services

Auth Service
-> Add user
-> Login
-> Refresh Token
-> Get Profile

Course Service
-> Add Module
-> Remove Module
-> Get All Modules
-> Update Module
-> Get Module Details

-> Create Course
-> Get Course
-> Delete Course
-> Update Course	

Course Progress
-> Update Course Progress
-> Enroll User
-> Course Enrollment Data


Progression Service
-> Trigger-xp
-> Get Leaderboard(SSE)
-> User XP Data

-> Create Xp Event
-> Get Xp Event
-> Update Xp Event
-> Delete Xp Event

Quiz Service
-> Create MCQ
-> Update MCQ
-> Delete MCQ
-> Get Mcq Details
-> Get All Mcqs

-> Start-Quiz
-> Submit-Quiz

-> Get User Quiz Attempts Data
-> Get Quiz Details
-> Add Quiz
-> Update Quiz
-> Delete Quiz