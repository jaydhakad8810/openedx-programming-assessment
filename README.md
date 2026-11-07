# Open edX Programming Assessment

An Open edX extension that allows instructors to create programming exams
and learners to write, run and submit code directly inside a course unit.

## Project Architecture

### 1. Frontend — Member 1
- React-based programming interface.
- Monaco code editor.
- Python, Java and C++ language selection.
- Run and Submit controls.
- Output and result panel.
- Exam interaction restrictions.
- Instructor authoring interface.

### 2. XBlock / Open edX Integration — Member 2
- Custom XBlock development.
- Studio integration.
- Instructor question configuration.
- LMS integration.
- Submission management and grade events.

### 3. Execution Service — Member 3
- Python, Java and C++ execution.
- Visible and hidden test evaluation.
- Compilation and runtime error handling.
- Execution timeouts and resource limits.
- Automated scoring.

## Repository Structure

frontend/          - React frontend
xblock/            - Open edX XBlock
execution-service/ - Code execution backend
docs/              - Technical documentation

## Frontend Development

The frontend is being developed using React, Vite and Monaco Editor.

Run locally:

    cd frontend
    npm install
    npm run dev

## Important

Learner-submitted code must execute in an isolated environment,
not directly inside the Open edX LMS process.

Run and Submit are currently frontend demonstrations and
will be connected to the backend services during integration.

## Development Progress

See TASK_LOG.md for completed tasks, pending work and testing updates.
