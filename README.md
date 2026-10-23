# Student Record and Task Management System

## Overview

The Student Record and Task Management System is a professional, browser-based application developed to demonstrate the practical implementation of fundamental data structure concepts through an interactive user interface. The project combines student record management with priority-based task processing in a single dashboard.

The application is built using HTML, CSS, and JavaScript, providing a responsive and user-friendly interface without requiring a backend server or database.

## Features

### Student Record Management
- Add new student records with names, roll numbers, and marks.
- Automatically calculate student grades based on marks.
- Search for students by name or roll number.
- Update existing student information.
- Delete student records.
- View student records in an organized table.

### Task Management
- Add tasks with different priority levels.
- View pending tasks in priority order.
- Process the next task according to its priority.
- Track recently processed tasks.
- Manage tasks through a simple and intuitive interface.

### Dashboard
- View student and task statistics.
- Access student records and task information from a centralized dashboard.
- Receive feedback through interactive notifications.
- Use the application on desktop and mobile devices.

## Technologies Used

- **HTML5** — Defines the structure of the application.
- **CSS3** — Provides styling, responsive layouts, and visual design.
- **JavaScript** — Implements application functionality and data management.
- **Local Storage** — Stores student records and tasks in the browser.

## Data Structures and Concepts

This project demonstrates the practical relevance of data structures in application development.

- **Student Records:** JavaScript arrays and object-based records are used to manage student information.
- **Priority-Based Task Processing:** Tasks are organized and processed according to their priority levels.
- **Searching:** Student records can be searched using names or roll numbers.
- **CRUD Operations:** Create, Read, Update, and Delete operations are implemented for student records.
- **Persistent Browser Storage:** Local Storage retains data between browser sessions on the same browser and origin.

Note: The data structure operations are implemented in JavaScript for the web application. The project does not execute Java data structures or use a server-side database.

## Project Structure

```text
student-record-task-management/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Installation and Usage

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code or another code editor.
3. Open `index.html` directly in a web browser, or run it using the Live Server extension in Visual Studio Code.
4. Use the dashboard to add, search, update, and delete student records.
5. Add tasks, assign priorities, and process pending tasks.

No backend server, database configuration, or additional package installation is required.

## Data Storage

The application uses the browser's Local Storage to save student records and tasks. The data remains available when the page is refreshed or the browser is reopened using the same browser profile and origin.

Clearing the browser's site data or using a different browser or device may make the saved records unavailable. The application does not provide cloud synchronization.

## Future Enhancements

- Export student records to CSV or PDF.
- Add sorting and filtering options.
- Introduce task deadlines and completion statistics.
- Implement user authentication and role-based access.
- Integrate a backend and database for centralized data storage.
- Add data import and backup functionality.

## Purpose

The primary objective of this project is to demonstrate how data structure concepts can support practical management operations while providing a clean, responsive, and accessible web interface.

## License

This project is intended for educational and academic purposes. A suitable open-source license can be added if the project is distributed for reuse or modification.
