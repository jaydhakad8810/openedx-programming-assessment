# Project Development Task Log

Project: Open edX Programming Assessment
Date: 7 November 2026

## Team Responsibilities

- Member 1: Frontend development
- Member 2: XBlock / Open edX integration
- Member 3: Execution service

## Completed Tasks

### Frontend — Member 1

- [x] Verified Node.js and npm.
- [x] Created React + Vite application.
- [x] Started the application successfully.
- [x] Installed Monaco Editor.
- [x] Created CodeEditor component.
- [x] Connected editor with App.jsx.
- [x] Created initial assessment interface.
- [x] Added initial CSS styling.
- [x] Verified interface in Firefox.

## Pending Tasks

### Frontend
- [ ] Improve responsive design.
- [ ] Implement language-specific starter code.
- [ ] Implement result and error displays.
- [ ] Implement exam interaction restrictions.
- [ ] Build instructor authoring interface.
- [ ] Agree on API contracts.
- [ ] Integrate with XBlock and execution service.
- [ ] Complete frontend testing.

### XBlock / Open edX
- [ ] Create custom XBlock package.
- [ ] Integrate with Studio.
- [ ] Implement LMS handlers.
- [ ] Implement submission persistence.
- [ ] Integrate grade events.

### Execution Service
- [ ] Design execution API.
- [ ] Implement isolated Python execution.
- [ ] Implement Java execution.
- [ ] Implement C++ execution.
- [ ] Implement visible and hidden tests.
- [ ] Implement timeouts and scoring.

## Current Notes

- Run and Submit are demonstration buttons only.
- Actual code execution and grading are not connected.
- Scoring must follow the manager-approved policy.
- Learner code must execute in an isolated environment.


## 7 November 2026 — Result Panel Development

- [x] Created reusable ResultPanel.jsx component.
- [x] Connected ResultPanel with App.jsx.
- [x] Added execution status display.
- [x] Added program output and error display support.
- [x] Added passed-test count display.
- [x] Added marks display support.
- [x] Tested demonstration submission results in Firefox.

Note: Run and Submit currently use simulated data.
Actual execution and grading APIs are pending backend integration.

## 13 November 2026 — Exam Editor Restrictions

- [x] Blocked copy, cut and paste events in Monaco Editor.
- [x] Blocked Ctrl+C, Ctrl+X and Ctrl+V shortcuts.
- [x] Added alternative shortcut restrictions:
      Ctrl+Insert, Shift+Insert and Shift+Delete.
- [x] Disabled Monaco editor context menu.
- [x] Blocked drag-and-drop text insertion.
- [x] Connected restriction warnings to React.
- [x] Added visible warning banner with dismiss option.
- [x] Tested copy, cut, paste and drag-and-drop in Firefox.
- [x] Verified alternative keyboard shortcuts.

Pending:
- [ ] Show a warning when right-click/context-menu is attempted.
- [ ] Complete broader exam restriction testing.

Note: Browser-side restrictions are deterrents, not a
guaranteed security boundary.
