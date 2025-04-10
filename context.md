# FiSabiLah API Documentation for Frontend Developers

This document provides a comprehensive guide to the FiSabiLah API, describing the available endpoints, data models, and expected request/response formats to help frontend developers build their applications.

## Data Models

The FiSabiLah application consists of three primary data models:

### 1. Chikhis

A "Chikhis" represents a main entity in the system.

**Schema:**
```json
{
  "id": number,
  "name": string,          // Required, Must be unique
  "description": string,   // Optional
  "created_at": timestamp,
  "updated_at": timestamp
}
```

### 2. Subjects

A "Subject" represents a topic or category that can be associated with videos.

**Schema:**
```json
{
  "id": number,
  "name": string,          // Required, Must be unique
  "description": string,   // Optional
  "created_at": timestamp,
  "updated_at": timestamp
}
```

### 3. Videos

A "Video" represents a media resource that belongs to both a Chikhis and a Subject.

**Schema:**
```json
{
  "id": number,
  "url": string,           // Required, Must be unique
  "platform": string,      // Optional (e.g., "YouTube", "Vimeo")
  "description": string,   // Optional
  "chikhi_id": number,     // Required, Foreign key to Chikhis
  "subject_id": number,    // Required, Foreign key to Subjects
  "created_at": timestamp,
  "updated_at": timestamp
}
```

## API Endpoints

The API follows RESTful conventions with standard CRUD operations for each resource.

### Chikhis Endpoints

#### GET /api/chikhis
Retrieves a list of all Chikhis.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Chikhis Name",
    "description": "Description text",
    "created_at": "2025-04-10T10:00:00.000000Z",
    "updated_at": "2025-04-10T10:00:00.000000Z"
  },
  // ...more chikhis
]
```

#### GET /api/chikhis/{id}
Retrieves a specific Chikhis by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Chikhis Name",
  "description": "Description text",
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T10:00:00.000000Z"
}
```

#### POST /api/chikhis
Creates a new Chikhis.

**Request:**
```json
{
  "name": "New Chikhis Name",
  "description": "Description for the new Chikhis"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "New Chikhis Name",
  "description": "Description for the new Chikhis",
  "created_at": "2025-04-10T10:30:00.000000Z",
  "updated_at": "2025-04-10T10:30:00.000000Z"
}
```

#### PUT/PATCH /api/chikhis/{id}
Updates an existing Chikhis.

**Request:**
```json
{
  "name": "Updated Chikhis Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Chikhis Name",
  "description": "Updated description",
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T11:00:00.000000Z"
}
```

#### DELETE /api/chikhis/{id}
Deletes a Chikhis by ID.

**Response:** Status 204 No Content

When a Chikhis is deleted, all associated Videos will also be deleted (cascade deletion).

### Subjects Endpoints

#### GET /api/subjects
Retrieves a list of all Subjects.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Subject Name",
    "description": "Description text",
    "created_at": "2025-04-10T10:00:00.000000Z",
    "updated_at": "2025-04-10T10:00:00.000000Z"
  },
  // ...more subjects
]
```

#### GET /api/subjects/{id}
Retrieves a specific Subject by ID.

**Response:**
```json
{
  "id": 1,
  "name": "Subject Name",
  "description": "Description text",
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T10:00:00.000000Z"
}
```

#### POST /api/subjects
Creates a new Subject.

**Request:**
```json
{
  "name": "New Subject Name",
  "description": "Description for the new Subject"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "New Subject Name",
  "description": "Description for the new Subject",
  "created_at": "2025-04-10T10:30:00.000000Z",
  "updated_at": "2025-04-10T10:30:00.000000Z"
}
```

#### PUT/PATCH /api/subjects/{id}
Updates an existing Subject.

**Request:**
```json
{
  "name": "Updated Subject Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Subject Name",
  "description": "Updated description",
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T11:00:00.000000Z"
}
```

#### DELETE /api/subjects/{id}
Deletes a Subject by ID.

**Response:** Status 204 No Content

When a Subject is deleted, all associated Videos will also be deleted (cascade deletion).

### Videos Endpoints

#### GET /api/videos
Retrieves a list of all Videos.

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://example.com/video1",
    "platform": "YouTube",
    "description": "Video description",
    "chikhi_id": 1,
    "subject_id": 1,
    "created_at": "2025-04-10T10:00:00.000000Z",
    "updated_at": "2025-04-10T10:00:00.000000Z"
  },
  // ...more videos
]
```

#### GET /api/videos/{id}
Retrieves a specific Video by ID.

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com/video1",
  "platform": "YouTube",
  "description": "Video description",
  "chikhi_id": 1,
  "subject_id": 1,
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T10:00:00.000000Z"
}
```

#### POST /api/videos
Creates a new Video.

**Request:**
```json
{
  "url": "https://example.com/new-video",
  "platform": "Vimeo",
  "description": "Description for the new video",
  "chikhi_id": 1,
  "subject_id": 2
}
```

**Response:**
```json
{
  "id": 2,
  "url": "https://example.com/new-video",
  "platform": "Vimeo",
  "description": "Description for the new video",
  "chikhi_id": 1,
  "subject_id": 2,
  "created_at": "2025-04-10T10:30:00.000000Z",
  "updated_at": "2025-04-10T10:30:00.000000Z"
}
```

#### PUT/PATCH /api/videos/{id}
Updates an existing Video.

**Request:**
```json
{
  "url": "https://example.com/updated-video",
  "platform": "YouTube",
  "description": "Updated description",
  "chikhi_id": 2,
  "subject_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "url": "https://example.com/updated-video",
  "platform": "YouTube",
  "description": "Updated description",
  "chikhi_id": 2,
  "subject_id": 1,
  "created_at": "2025-04-10T10:00:00.000000Z",
  "updated_at": "2025-04-10T11:00:00.000000Z"
}
```

#### DELETE /api/videos/{id}
Deletes a Video by ID.

**Response:** Status 204 No Content

## Relationships

The models have the following relationships:

1. **One-to-Many Relationship**: 
   - A Chikhis can have multiple Videos
   - A Subject can have multiple Videos

2. **Many-to-One Relationship**:
   - A Video belongs to one Chikhis
   - A Video belongs to one Subject

## Frontend Implementation Recommendations

### 1. Setup and Authentication

- Use a modern JavaScript framework (React, Vue, Angular)
- Set up API client with appropriate authentication headers
- Create interceptors to handle API errors and refresh tokens

### 2. Main Features to Implement

#### Chikhis Management
- Display a list of all Chikhis with search and pagination
- Create a form to add new Chikhis
- Edit and delete functionality with confirmation dialogs

#### Subjects Management
- Display a list of all Subjects with search and pagination
- Create a form to add new Subjects
- Edit and delete functionality with confirmation dialogs

#### Videos Management
- Display a list of all Videos with search, filtering, and pagination
- Create a form to add new Videos (with dropdowns for selecting Chikhis and Subjects)
- Edit and delete functionality with confirmation dialogs
- Video player integration based on platform (YouTube, Vimeo, etc.)

#### Advanced Features
- Dashboard with analytics
- Filtering videos by Chikhis and/or Subject
- Video preview thumbnails
- Drag-and-drop reordering of videos

### 3. Example API Call Implementation

```javascript
// Example of deleting a Chikhis using Axios
const deleteChikhis = async (chikhisId) => {
  try {
    await axios.delete(`/api/chikhis/${chikhisId}`);
    // Handle successful deletion (update UI, show notification)
    return true;
  } catch (error) {
    // Handle errors (show error message)
    console.error('Error deleting chikhis:', error);
    return false;
  }
};
```

### 4. Error Handling

Ensure your frontend application handles these common API errors:
- 404: Resource not found
- 422: Validation errors (display specific field errors)
- 401/403: Authentication/Authorization issues
- 500: Server errors

## Summary

This API provides a complete CRUD interface for managing Chikhis, Subjects, and Videos. The frontend should implement interfaces for all these operations, with appropriate forms, validation, and user feedback.

Remember that when deleting a Chikhis or Subject, all associated Videos will also be deleted due to the cascade delete constraints in the database.