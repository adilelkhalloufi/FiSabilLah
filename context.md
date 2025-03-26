# React App: Chikh Video Manager

## Project Overview
Create a React application to manage a list of chikhs, subjects, and related YouTube video links without a backend.

## Features
1. **Chikh Management**
   - Add Chikhs
   - List Chikhs
   - Search Chikhs

2. **Subject Management**
   - Associate subjects with each Chikh
   - Add subjects per Chikh

3. **Video Management**
   - Add YouTube video links under each subject
   - View videos by subject

4. **Search and Filter**
   - Search by Chikh name, subject, or video title

## Tech Stack
- **Frontend:** React
- **State Management:** useState, useEffect, Context API
- **Storage:** Firebase Realtime Database
- **UI Library:** Tailwind Css

## Components
1. `App` - Main component
2. `ChikhList` - Displays list of chikhs with search
3. `ChikhDetail` - Shows subjects and videos for a selected chikh
4. `SubjectForm` - Form to add subjects under a chikh
5. `VideoForm` - Form to add YouTube links under subjects
6. `VideoList` - Displays video links with embedded player

## Data Storage
The data will be stored in Firebase Realtime Database.

### Data Structure
```javascript
// Firebase Realtime Database Structure
{
  "chikhs": {
    "chikhId1": {
      "name": "Chikh Name",
      "description": "Brief description",
      "createdAt": timestamp
    }
  },
  "subjects": {
    "subjectId1": {
      "chikhId": "chikhId1",
      "name": "Subject Name",
      "description": "Subject description",
      "createdAt": timestamp
    }
  },
  "videos": {
    "videoId1": {
      "subjectId": "subjectId1",
      "title": "Video Title",
      "url": "https://youtube.com/watch?v=example1",
      "description": "Video description",
      "createdAt": timestamp
    }
  }
}
```

## Additional Notes
- Use LocalStorage to persist data.
- Implement a simple context for global state management.
- Add a search bar to filter chikhs and subjects.
- Ensure a responsive design.

## Implementation Steps

1. **Project Setup**
   ```bash
   npx create-react-app fi-sabillah
   cd fi-sabillah
   npm install firebase react-firebase-hooks
   ```

2. **Create Project Structure**
   ```
   src/
   ├── components/
   │   ├── ChikhList/
   │   ├── ChikhDetail/
   │   ├── SubjectForm/
   │   ├── VideoForm/
   │   └── VideoList/
   ├── context/
   │   └── AppContext.js
   ├── config/
   │   └── firebase.js
   ├── services/
   │   └── firebaseService.js
   └── utils/
       └── helpers.js
   ```

3. **Firebase Setup**
   - Create Firebase project
   - Enable Realtime Database
   - Configure security rules

4. **Implementation Order**
   1. Configure Firebase connection
   2. Create Firebase service methods for CRUD operations
   3. Implement AppContext with Firebase integration
   4. Create components with real-time updates
   5. Implement search functionality using Firebase queries
   6. Implement responsive design

