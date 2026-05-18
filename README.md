# Employee Management System

## Overview
This repository contains a full-stack Employee Management System with a React/Vite frontend (`ems_client`) and a Node/Express backend (`ems_server`). The application supports authentication, role-based portals, attendance, leave management, overtime requests, payslips, notifications, and profile management.

## Current Status
The project is under active development. The key work completed so far includes:

- Added a root homepage landing page and optimized initial route loading in the frontend.
- Implemented role-based login portals for Admin, Manager, and Employee.
- Added login redirect/gated behavior for already authenticated users.
- Added attendance-based gating for overtime requests, so employees can only request overtime after completing attendance.
- Added employee creation notifications in the backend.
- Added forgot password and settings logic for password security.
- Implemented password expiration and related session handling.
- Added backend APIs and controller logic for attendance checks and guard features.

## Project Structure

- `ems_client/`
  - `src/`: React frontend source code
  - `components/`: UI components such as login screens, dashboards, attendance forms, notifications, and modals
  - `pages/`: Route-based page components like `Dashboard`, `LoginLanding`, `Attendance`, `Overtime`, `Leave`, `PaySlips`, and `Settings`
  - `context/`: Authentication context and state management
  - `api/`: Axios setup for backend communication

- `ems_server/`
  - `controllers/`: Request handling logic for auth, attendance, employees, leave, payslips, notifications, and more
  - `routes/`: Express routes grouped by feature
  - `models/`: Mongoose schemas for users, employees, attendance, leave, notifications, and related entities
  - `middleware/`: Authentication middleware and request guards
  - `config/`: Database and email configuration

## Notable Completed Features

### Frontend
- `LoginLanding.jsx`: Added portal selection and authenticated-user call-to-action.
- `LoginForm.jsx`: Added dashboard redirect when the user is already signed in.
- `App.jsx`: Configured root route handling and lazy-loaded pages to improve homepage load speed.
- `Overtime.jsx`: Added a backend check before showing overtime request UI.
- `AuthContext.jsx`: Added password expiration state tracking and improved login flow.

### Backend
- `attendanceController.js`: Added `checkCompletedAttendance` logic to verify completed attendance before overtime.
- `attendanceRoutes.js`: Registered `/attendance/check-completed` guard endpoint.
- `employeeController.js`: Added notifications creation when a new employee is created.
- `models/User.js`: Added `passwordLastChanged` support for password expiration.

## How to Run

### Backend
1. Open terminal and go to `ems_server`
2. Install dependencies: `npm install`
3. Start server: `npm run dev` or `node server.js`

### Frontend
1. Open terminal and go to `ems_client`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Build production assets: `npm run build`

## Notes
- The frontend build currently succeeds and the login landing page now displays a dashboard button for authenticated users.
- This README summarizes the most recent work and helps track the features added so far.

## Next Steps
- Verify final dashboard navigation and role-based dashboard content.
- Improve the landing page performance further if needed.
- Continue building missing UI pages and refine authentication flows.
