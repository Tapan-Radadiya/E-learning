# Quiz Service API Documentation

## Overview
This is a comprehensive API documentation for the Quiz Service built with Go and Fiber framework. The service provides functionality for managing quizzes, MCQs, and quiz attempts with authentication middleware.

**Base URL:** `http://localhost:3004`

**Authentication:** All endpoints require authentication via middleware that validates user tokens and sets `UserId` in context.

---

## REST API Endpoints

### 1. Quiz Management APIs

#### Base Route: `/quiz`

##### 1.1 Create Quiz
- **Endpoint:** `POST /quiz/add`
- **Purpose:** Create a new quiz
- **Authentication:** Required
- **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "course_id": "uuid",
  "totalquestion": "integer",
  "passingmarks": "integer"
}
```
- **Success Response:** `201 Created`
```json
{
  "message": "Quiz Created",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "course_id": "uuid",
    "totalquestion": "integer",
    "passingmarks": "integer",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Missing Data" | "Error Creating Quiz",
  "err": "error details"
}
```

##### 1.2 Get Quiz Data
- **Endpoint:** `GET /quiz/{quizId}`
- **Purpose:** Retrieve specific quiz information
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (string): Quiz identifier
- **Success Response:** `200 OK`
```json
{
  "message": "QuizData Fetched",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "course_id": "uuid",
    "totalquestion": "integer",
    "passingmarks": "integer",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId" | "Error Fetching QuizData"
}
```

##### 1.3 Update Quiz
- **Endpoint:** `PATCH /quiz/{quizId}`
- **Purpose:** Update existing quiz information
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (uuid): Quiz identifier
- **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "course_id": "uuid",
  "totalquestion": "integer",
  "passingmarks": "integer"
}
```
- **Success Response:** `200 OK`
```json
{
  "message": "Quiz Updated Successfully",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "course_id": "uuid",
    "totalquestion": "integer",
    "passingmarks": "integer",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId" | "Invalid Body" | "Error Updating Quiz"
}
```

##### 1.4 Delete Quiz
- **Endpoint:** `DELETE /quiz/{quizId}`
- **Purpose:** Delete a specific quiz
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (uuid): Quiz identifier
- **Success Response:** `200 OK`
```json
{
  "message": "Quiz Deleted",
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "course_id": "uuid",
    "totalquestion": "integer",
    "passingmarks": "integer",
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId" | "Unable To Delete Quiz"
}
```

##### 1.5 Get User Quiz Attempts
- **Endpoint:** `GET /quiz/quiz-attempts`
- **Purpose:** Retrieve all quiz attempts for the authenticated user
- **Authentication:** Required
- **Success Response:** `200 OK`
```json
{
  "message": "data fetched",
  "data": [
    {
      "id": "uuid",
      "userid": "uuid",
      "quizid": "uuid",
      "quiz": {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "course_id": "uuid",
        "totalquestion": "integer",
        "passingmarks": "integer"
      },
      "createdat": "timestamp",
      "updatedat": "timestamp"
    }
  ]
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid userId" | "error fetching quiz data",
  "err": "error details"
}
```

---

### 2. MCQ Management APIs

#### Base Route: `/mcq`

##### 2.1 Create MCQ
- **Endpoint:** `POST /mcq/{courseId}`
- **Purpose:** Create a new MCQ for a specific course
- **Authentication:** Required
- **Path Parameters:**
  - `courseId` (uuid): Course identifier
- **Request Body:**
```json
{
  "question": "string",
  "options": [
    {
      "option": "string",
      "is_correct": "boolean"
    }
  ]
}
```
- **Success Response:** `200 OK`
```json
{
  "message": "Mcq Created",
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "question": "string",
    "options": [
      {
        "id": "uuid",
        "option": "string",
        "mcqid": "uuid",
        "is_correct": "boolean",
        "createdat": "timestamp",
        "updatedat": "timestamp"
      }
    ],
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId" | "Invalid Body" | "Error Inserting Mcq",
  "error": "error details"
}
```

##### 2.2 Get MCQ Details
- **Endpoint:** `GET /mcq/{mcqId}`
- **Purpose:** Retrieve specific MCQ information
- **Authentication:** Required
- **Path Parameters:**
  - `mcqId` (uuid): MCQ identifier
- **Success Response:** `200 OK`
```json
{
  "message": "Data Fetched",
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "question": "string",
    "options": [
      {
        "id": "uuid",
        "option": "string",
        "mcqid": "uuid",
        "is_correct": "boolean",
        "createdat": "timestamp",
        "updatedat": "timestamp"
      }
    ],
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid McqId" | "Error Fethcing McqData",
  "error": "error details"
}
```

##### 2.3 Get All MCQs for Quiz
- **Endpoint:** `GET /mcq/get-all-mcqs/{quizId}`
- **Purpose:** Retrieve all MCQs for a specific quiz
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (uuid): Quiz identifier
- **Success Response:** `200 OK`
```json
{
  "message": "Data Fetched",
  "data": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "question": "string",
      "options": [
        {
          "id": "uuid",
          "option": "string",
          "mcqid": "uuid",
          "is_correct": "boolean",
          "createdat": "timestamp",
          "updatedat": "timestamp"
        }
      ],
      "createdat": "timestamp",
      "updatedat": "timestamp"
    }
  ]
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid McqId" | "Error Fethcing All Mcqs",
  "error": "error details"
}
```

##### 2.4 Update MCQ
- **Endpoint:** `PUT /mcq/{mcqId}`
- **Purpose:** Update existing MCQ information
- **Authentication:** Required
- **Path Parameters:**
  - `mcqId` (uuid): MCQ identifier
- **Request Body:**
```json
{
  "question": "string",
  "options": [
    {
      "option": "string",
      "is_correct": "boolean"
    }
  ]
}
```
- **Success Response:** `200 OK`
```json
{
  "message": "Mcq Updated",
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "question": "string",
    "options": [
      {
        "id": "uuid",
        "option": "string",
        "mcqid": "uuid",
        "is_correct": "boolean",
        "createdat": "timestamp",
        "updatedat": "timestamp"
      }
    ],
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid McqId" | "Error Parsing Body" | "Error Updating Mcq",
  "err": "error details"
}
```

##### 2.5 Delete MCQ
- **Endpoint:** `DELETE /mcq/{mcqId}`
- **Purpose:** Delete a specific MCQ
- **Authentication:** Required
- **Path Parameters:**
  - `mcqId` (uuid): MCQ identifier
- **Success Response:** `200 OK`
```json
{
  "message": "Mcq Deleted",
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "question": "string",
    "options": [...],
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid McqId" | "Error Deleting Mcq"
}
```

---

### 3. Quiz Attempt APIs

#### Base Route: `/quiz-attempt`

##### 3.1 Start Quiz
- **Endpoint:** `GET /quiz-attempt/start-quiz/{quizId}`
- **Purpose:** Start a quiz attempt for the authenticated user
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (uuid): Quiz identifier
- **Success Response:** `200 OK`
```json
{
  "message": "Done",
  "data": {
    "id": "uuid",
    "userid": "uuid",
    "quizid": "uuid",
    "quiz": {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "course_id": "uuid",
      "totalquestion": "integer",
      "passingmarks": "integer"
    },
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId Format" | "error parsing userid" | "Error",
  "err": "error details"
}
```

##### 3.2 Submit Quiz
- **Endpoint:** `GET /quiz-attempt/submit-quiz/{quizId}`
- **Purpose:** Submit quiz answers and get results
- **Authentication:** Required
- **Path Parameters:**
  - `quizId` (uuid): Quiz identifier
- **Request Body:**
```json
{
  "QuizAnswer": [
    {
      "questionId": "string",
      "answerId": "string"
    }
  ]
}
```
- **Success Response:** `200 OK`
```json
{
  "message": "Quiz Submitted Successfully",
  "data": {
    "id": "uuid",
    "is_passed": "boolean",
    "score": "integer",
    "quiz_attempt_id": "uuid",
    "quiz_attempts": {
      "id": "uuid",
      "userid": "uuid",
      "quizid": "uuid",
      "quiz": {...},
      "createdat": "timestamp",
      "updatedat": "timestamp"
    },
    "createdat": "timestamp",
    "updatedat": "timestamp"
  }
}
```
- **Error Response:** `409 Conflict`
```json
{
  "message": "Invalid QuizId Format" | "error parsing userid" | "Error Parsing Data" | "Error Submitting Quiz",
  "err": "error details"
}
```

---

## gRPC Services

The application integrates with two external gRPC services:

### 1. Course Service gRPC Client

**Connection:** `localhost:50051`

#### 1.1 GetCourseData
- **Service:** `CourseService`
- **Method:** `GetCourseData`
- **Purpose:** Retrieve course information by course ID
- **Request:**
```protobuf
message CourseDataRequest {
    string course_id = 1;
}
```
- **Response:**
```protobuf
message CourseDataResponse {
    CourseDetails courseData = 1;
}

message CourseDetails {
    string id = 1;
    string title = 2;
    string description = 3;
    string thumbnail_url = 4;
    string createdAt = 5;
    string updatedAt = 6;
}
```

#### 1.2 GetCourseModuleData
- **Service:** `CourseService`
- **Method:** `GetCourseModuleData`
- **Purpose:** Retrieve course module information by module ID
- **Request:**
```protobuf
message CourseModuleDataRequest {
    string module_id = 1;
}
```
- **Response:**
```protobuf
message CourseModuleDataResponse {
    string id = 1;
    string title = 2;
    string description = 3;
    int32 completion_percentage = 4;
    string course_id = 5;
}
```

### 2. Course Progress Service gRPC Client

**Connection:** `localhost:50054`

#### 2.1 GetCourseProgress
- **Service:** `CourseProgressService`
- **Method:** `GetCourseProgress`
- **Purpose:** Retrieve course progress for a specific user and course
- **Request:**
```protobuf
message CourseProgressRequest {
    string userId = 1;
    string courseId = 2;
}
```
- **Response:**
```protobuf
message CourseProgressResponse {
    CourseProgression courseProgressData = 1;
}

message CourseProgression {
    string id = 1;
    optional int32 progress_percent = 2;
    optional bool is_completed = 3;
}
```

---

## Data Models

### Quiz Model
```go
type Quizes struct {
    ID            uuid.UUID `json:"id"`
    Title         string    `json:"title"`
    Description   string    `json:"description"`
    CourseId      uuid.UUID `json:"course_id"`
    TotalQuestion int       `json:"totalquestion"`
    PassingMarks  int       `json:"passingmarks"`
    CreatedAt     time.Time `json:"createdat"`
    UpdatedAt     time.Time `json:"updatedat"`
}
```

### MCQ Model
```go
type Mcqs struct {
    ID        uuid.UUID    `json:"id"`
    CourseId  uuid.UUID    `json:"course_id"`
    Question  string       `json:"question"`
    Options   []McqOptions `gorm:"foreignKey:MCQId"`
    CreatedAt time.Time    `json:"createdat"`
    UpdatedAt time.Time    `json:"updatedat"`
}

type McqOptions struct {
    ID         uuid.UUID `json:"id"`
    OptionText string    `json:"option"`
    MCQId      uuid.UUID `json:"mcqid"`
    IsCorrect  bool      `json:"is_correct"`
    CreatedAt  time.Time `json:"createdat"`
    UpdatedAt  time.Time `json:"updatedat"`
}
```

### Quiz Attempt Model
```go
type QuizAttempts struct {
    ID        uuid.UUID `json:"id"`
    UserId    uuid.UUID `json:"userid"`
    QuizId    uuid.UUID `json:"quizid"`
    Quiz      Quizes    `json:"quiz"`
    CreatedAt time.Time `json:"createdat"`
    UpdatedAt time.Time `json:"updatedat"`
}

type QuizScore struct {
    ID            uuid.UUID    `json:"id"`
    IsPassed      bool         `json:"is_passed"`
    Score         int          `json:"score"`
    QuizAttemptId uuid.UUID    `json:"quiz_attempt_id"`
    QuizAttempts  QuizAttempts `json:"quiz_attempts"`
    CreatedAt     time.Time    `json:"createdat"`
    UpdatedAt     time.Time    `json:"updatedat"`
}
```

---

## Authentication & Middleware

All API endpoints require authentication through the `AuthincateUser` middleware which:
- Validates user authentication tokens
- Sets `UserId` in the Fiber context
- Returns 401/403 for unauthorized requests

---

## Error Handling

The API uses consistent error response format:
```json
{
  "message": "Error description",
  "err": "Detailed error information (optional)"
}
```

Common HTTP status codes:
- `200 OK` - Successful GET/PUT/DELETE operations
- `201 Created` - Successful POST operations
- `409 Conflict` - Validation errors, business logic errors
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied

---

## Environment Configuration

The service requires the following environment variables:
- Database connection settings
- gRPC service endpoints (localhost:50051, localhost:50054)
- Authentication configuration

**Service Port:** `3004`