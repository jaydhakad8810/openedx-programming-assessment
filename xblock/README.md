# Programming Assessment XBlock

Custom Open edX XBlock for programming assessments.
## Current functionality

- Displays a coding question and description.
- Displays maximum marks and time limit.
- Supports Python, Java, and C++ configuration.
- Provides a custom Studio configuration form.
- Allows instructors to configure starter code.
- Allows instructors to configure visible and hidden test cases.
- Saves configuration through a JSON handler with basic validation.

## Planned functionality

- React and Monaco Editor integration.
- Run and Submit handlers.
- Execution-service integration.
- Submission persistence.
- Open edX gradebook integration.
## Registration

The XBlock is registered using the `xblock.v1` entry-point group.

Entry-point name:

programming_assessment

## Important

Student code must execute through a separate isolated execution service.
It must never execute inside the Open edX LMS process.
