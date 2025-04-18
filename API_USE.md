# FiSabiLah API Documentation

This document provides instructions for front-end developers on how to interact with the FiSabiLah API.

## Table of Contents
- [Authentication](#authentication)
  - [Register](#register-a-new-user)
  - [Login](#login)
  - [Logout](#logout)
  - [Get Current User](#get-current-user)
- [Social Accounts](#social-accounts)
  - [Get All Social Accounts](#get-all-social-accounts)
  - [Add a Social Account](#add-a-social-account)
  - [Get a Single Social Account](#get-a-single-social-account)
  - [Remove a Social Account](#remove-a-social-account)
- [Videos](#videos)
  - [Get All Videos](#get-all-videos)
  - [Upload a Video](#upload-a-video)
  - [Get a Single Video](#get-a-single-video)
  - [Update a Video](#update-a-video)
  - [Delete a Video](#delete-a-video)
- [Scheduled Posts](#scheduled-posts)
  - [Get All Scheduled Posts](#get-all-scheduled-posts)
  - [Create a Scheduled Post](#create-a-scheduled-post)
  - [Get a Single Scheduled Post](#get-a-single-scheduled-post)
  - [Update a Scheduled Post](#update-a-scheduled-post)
  - [Delete a Scheduled Post](#delete-a-scheduled-post)
- [Other Resources](#other-resources)
  - [Chikhis](#chikhis)
  - [Subjects](#subjects)
  - [Tags](#tags)

## Authentication

### Register a new user
**POST** `/api/register`

**Request body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  "access_token": "1|laravel_sanctum_token...",
  "token_type": "Bearer"
}
```

### Login
**POST** `/api/login`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  },
  "access_token": "1|laravel_sanctum_token...",
  "token_type": "Bearer"
}
```

### Logout
**POST** `/api/logout`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

### Get Current User
**GET** `/api/user`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "User Name",
  "email": "user@example.com",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

## Social Accounts

All social account endpoints require authentication.

### Get All Social Accounts
**GET** `/api/social-accounts`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "platform": "tiktok",
    "platform_user_id": "tiktok_user_123",
    "username": "tiktok_username",
    "access_token": "[encrypted]",
    "refresh_token": "[encrypted]",
    "token_expires_at": "2023-12-31T23:59:59.000000Z",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
]
```

### Add a Social Account
**POST** `/api/social-accounts`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request body:**
```json
{
  "platform": "tiktok", // one of: tiktok, instagram, facebook, youtube
  "platform_user_id": "tiktok_user_123",
  "username": "tiktok_username",
  "access_token": "platform_access_token",
  "refresh_token": "platform_refresh_token", // optional
  "token_expires_at": "2023-12-31T23:59:59.000000Z" // optional
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "tiktok",
  "platform_user_id": "tiktok_user_123",
  "username": "tiktok_username",
  "access_token": "[encrypted]",
  "refresh_token": "[encrypted]",
  "token_expires_at": "2023-12-31T23:59:59.000000Z",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

### Get a Single Social Account
**GET** `/api/social-accounts/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "tiktok",
  "platform_user_id": "tiktok_user_123",
  "username": "tiktok_username",
  "access_token": "[encrypted]",
  "refresh_token": "[encrypted]",
  "token_expires_at": "2023-12-31T23:59:59.000000Z",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

### Remove a Social Account
**DELETE** `/api/social-accounts/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "message": "Account disconnected successfully"
}
```

## Videos

All video endpoints require authentication.

### Get All Videos
**GET** `/api/videos`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "My Video",
    "caption": "This is a great video",
    "hashtags": "#viral #trending",
    "file_path": "videos/filename.mp4",
    "status": "uploaded",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
]
```

### Upload a Video
**POST** `/api/videos`

**Headers:**
```
Authorization: Bearer {your_token}
Content-Type: multipart/form-data
```

**Request body:**
```
video: [video file] (required)
title: My Video (optional)
caption: This is a great video (optional)
hashtags: #viral #trending (optional)
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "My Video",
  "caption": "This is a great video",
  "hashtags": "#viral #trending",
  "file_path": "videos/filename.mp4",
  "status": "uploaded",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

### Get a Single Video
**GET** `/api/videos/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "My Video",
  "caption": "This is a great video",
  "hashtags": "#viral #trending",
  "file_path": "videos/filename.mp4",
  "status": "uploaded",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "scheduled_posts": [] // List of scheduled posts using this video
}
```

### Update a Video
**PUT/PATCH** `/api/videos/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request body:**
```json
{
  "title": "Updated Title",
  "caption": "Updated caption",
  "hashtags": "#updated #tags"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Updated Title",
  "caption": "Updated caption",
  "hashtags": "#updated #tags",
  "file_path": "videos/filename.mp4",
  "status": "uploaded",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

### Delete a Video
**DELETE** `/api/videos/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "message": "Video deleted successfully"
}
```

## Scheduled Posts

All scheduled post endpoints require authentication.

### Get All Scheduled Posts
**GET** `/api/scheduled-posts`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "video_id": 1,
    "social_account_id": 1,
    "title": "Post Title",
    "caption": "Post caption",
    "hashtags": "#scheduled #post",
    "scheduled_at": "2023-05-01T12:00:00.000000Z",
    "status": "pending",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "video": {
      "id": 1,
      "title": "My Video",
      "file_path": "videos/filename.mp4",
      "status": "uploaded"
    },
    "social_account": {
      "id": 1,
      "platform": "tiktok",
      "username": "tiktok_username"
    }
  }
]
```

### Create a Scheduled Post
**POST** `/api/scheduled-posts`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request body:**
```json
{
  "video_id": 1,
  "social_account_id": 1,
  "title": "Post Title",
  "caption": "Post caption",
  "hashtags": "#scheduled #post",
  "scheduled_at": "2023-05-01T12:00:00.000000Z"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user_id": 1,
  "video_id": 1,
  "social_account_id": 1,
  "title": "Post Title",
  "caption": "Post caption",
  "hashtags": "#scheduled #post",
  "scheduled_at": "2023-05-01T12:00:00.000000Z",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "video": {
    "id": 1,
    "title": "My Video",
    "file_path": "videos/filename.mp4",
    "status": "uploaded"
  },
  "social_account": {
    "id": 1,
    "platform": "tiktok",
    "username": "tiktok_username"
  }
}
```

### Get a Single Scheduled Post
**GET** `/api/scheduled-posts/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "video_id": 1,
  "social_account_id": 1,
  "title": "Post Title",
  "caption": "Post caption",
  "hashtags": "#scheduled #post",
  "scheduled_at": "2023-05-01T12:00:00.000000Z",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "video": {
    "id": 1,
    "title": "My Video",
    "file_path": "videos/filename.mp4",
    "status": "uploaded"
  },
  "social_account": {
    "id": 1,
    "platform": "tiktok",
    "username": "tiktok_username"
  }
}
```

### Update a Scheduled Post
**PUT/PATCH** `/api/scheduled-posts/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Request body:**
```json
{
  "title": "Updated Title",
  "caption": "Updated caption",
  "hashtags": "#updated #tags",
  "scheduled_at": "2023-06-01T15:00:00.000000Z"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "video_id": 1,
  "social_account_id": 1,
  "title": "Updated Title",
  "caption": "Updated caption",
  "hashtags": "#updated #tags",
  "scheduled_at": "2023-06-01T15:00:00.000000Z",
  "status": "pending",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "video": {
    "id": 1,
    "title": "My Video",
    "file_path": "videos/filename.mp4",
    "status": "uploaded"
  },
  "social_account": {
    "id": 1,
    "platform": "tiktok",
    "username": "tiktok_username"
  }
}
```

**Note:** You can only update posts with "pending" status.

### Delete a Scheduled Post
**DELETE** `/api/scheduled-posts/{id}`

**Headers:**
```
Authorization: Bearer {your_token}
```

**Response (200 OK):**
```json
{
  "message": "Scheduled post deleted successfully"
}
```

**Note:** You can only delete posts with "pending" status.

## Other Resources

The API also includes these resource endpoints:

### Chikhis
- GET `/api/chikhis` - List all chikhis
- POST `/api/chikhis` - Create a chikhi
- GET `/api/chikhis/{id}` - Get a single chikhi
- PUT/PATCH `/api/chikhis/{id}` - Update a chikhi
- DELETE `/api/chikhis/{id}` - Delete a chikhi

### Subjects
- GET `/api/subjects` - List all subjects
- POST `/api/subjects` - Create a subject
- GET `/api/subjects/{id}` - Get a single subject
- PUT/PATCH `/api/subjects/{id}` - Update a subject
- DELETE `/api/subjects/{id}` - Delete a subject

### Tags
- GET `/api/tags` - List all tags
- POST `/api/tags` - Create a tag
- GET `/api/tags/{id}` - Get a single tag
- PUT/PATCH `/api/tags/{id}` - Update a tag
- DELETE `/api/tags/{id}` - Delete a tag
