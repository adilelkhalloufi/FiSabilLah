# Application Context

## Project Overview
This project aims to create an application that provides a list of scholars (chikhs), the subjects they talk about, and the links to videos where they discuss these subjects. The application will be built using React for the frontend and will store data in a portable format that can be easily pushed to GitHub along with the project files.

## Requirements
1. **Frontend**: The frontend of the application will be built using React.
2. **Data Storage**: The data about the scholars, subjects, and video links should be stored in a portable format (e.g., text files or JSON files) to ensure that it can be easily shared and pushed to GitHub.
3. **Functionality**:
   - Display a list of scholars (chikhs).
   - For each scholar, display the subjects they talk about.
   - Provide links to videos where the scholars discuss these subjects.
   - Allow users to search for scholars or subjects.
   - Ensure that the data is easily maintainable and can be updated as needed.

## Data Format
The data will be stored in JSON files to ensure portability and ease of use. Here is an example of the data format:

### scholars.json
```json
[
  {
    "name": "Chikh Name",
    "subjects": [
      {
        "subject": "Subject 1",
        "video_link": "https://example.com/video1"
      },
      {
        "subject": "Subject 2",
        "video_link": "https://example.com/video2"
      }
    ]
  },
  {
    "name": "Another Chikh",
    "subjects": [
      {
        "subject": "Subject A",
        "video_link": "https://example.com/videoA"
      },
      {
        "subject": "Subject B",
        "video_link": "https://example.com/videoB"
      }
    ]
  }
]
```

## Project Structure
The project will have the following structure:
```
/project-root
│
├── /public
│   ├── index.html
│   └── ...
│
├── /src
│   ├── /components
│   │   ├── ScholarList.js
│   │   ├── ScholarDetails.js
│   │   └── ...
│   │
│   ├── /data
│   │   ├── scholars.json
│   │   └── ...
│   │
│   ├── App.js
│   ├── index.js
│   └── ...
│
├── .gitignore
├── context.md
└── package.json
```

## Instructions for AI
Please create the necessary React components and structure the project as described above. Ensure that the data is loaded from the JSON file and displayed correctly in the application. Provide functionality for searching scholars and subjects.
