# Open edX Programming Assessment

An Open edX extension that enables instructors to create programming assessments and allows learners to write, run, and submit code directly within an Open edX course.

The project integrates a React-based programming interface with a custom Open edX XBlock. It is designed to support Python, Java, and C++ programming assessments.

> **Development status:** The React frontend and XBlock integration are implemented. Run and Submit currently use mock execution responses. Actual code execution, Docker isolation, automated test evaluation, and scoring are pending execution-service integration.

---

## 1. Features

### Learner Features
- Monaco-based code editor.
- Python, Java, and C++ language selection.
- Starter code support.
- Run and Submit buttons.
- Execution output and result panel.
- Submission status display.
- Basic browser-level copy, cut, paste, and context-menu restrictions.

### Instructor Features
- Native Open edX Studio configuration.
- Custom programming question title and description.
- Programming language selection.
- Starter code configuration.
- Visible test case configuration.
- Hidden test case configuration.
- Execution time limit.
- Maximum marks configuration.
- Configuration validation and saving.

### Open edX Integration
- Custom XBlock implementation.
- Learner view integration.
- Studio configuration view.
- XBlock JSON handlers.
- Frontend-to-XBlock communication.
- Question configuration persistence.

---

## 2. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Code Editor | Monaco Editor |
| Backend Integration | Python |
| LMS Integration | Open edX XBlock |
| Packaging | Python setuptools |
| Development Platform | Tutor |
| Supported Languages | Python, Java, C++ |

---

## 3. Repository Structure

```text
openedx-programming-assessment/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   └── InstructorAuthoring.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── xblock/
│   ├── programming_assessment/
│   │   ├── programming_assessment.py
│   │   ├── execution_client.py
│   │   └── public/
│   │       └── assets/
│   │           ├── index.js
│   │           └── index.css
│   ├── setup.py
│   └── MANIFEST.in
│
├── README.md
└── TASK_LOG.md
```

---

## 4. Prerequisites

Before setting up the project, install:

- Python 3
- Node.js and npm
- Git
- Tutor
- A working Open edX environment

The XBlock was developed and tested using Tutor 19.0.1 and Open edX Sumac.1.

---

## 5. Clone the Repository

```bash
git clone https://github.com/jaydhakad8810/openedx-programming-assessment.git

cd openedx-programming-assessment
```

---

## 6. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

To create production assets:

```bash
npm run build
```

The production build is generated in the `dist/` directory.

To update the assets bundled with the XBlock, copy the generated JavaScript and CSS files into:

```text
xblock/programming_assessment/public/assets/
```

The XBlock loads the production assets from this directory.

---

## 7. XBlock Installation in Open edX

The XBlock is packaged as a Python distribution.

### Step 1: Understand the package

The package configuration is available in:

```text
xblock/setup.py
```

It registers the XBlock using the `xblock.v1` entry point.

### Step 2: Install through Tutor

For a Tutor-based Open edX installation, create a Tutor plugin file in the Tutor plugins directory.

Example plugin:

```python
from tutor import hooks

XBLOCK_PACKAGE = (
    "git+https://github.com/jaydhakad8810/"
    "openedx-programming-assessment.git@main"
    "#subdirectory=xblock"
)

hooks.Filters.ENV_PATCHES.add_item(
    (
        "openedx-dockerfile-post-python-requirements",
        f"RUN pip install '{XBLOCK_PACKAGE}'",
    )
)
```

Save the file as:

```text
programming-assessment.py
```

Enable the plugin:

```bash
tutor plugins enable programming-assessment
```

Save Tutor configuration:

```bash
tutor config save
```

Rebuild the Open edX image so that the XBlock package is installed:

```bash
tutor images build openedx
```

Then launch or restart the local Open edX environment:

```bash
tutor local launch
```

For an existing environment after the image has been rebuilt, restart the required LMS and CMS services as appropriate.

> **Note:** These commands describe the Tutor plugin installation approach. The exact deployment procedure may vary depending on the Tutor version and environment.

---

## 8. Adding a Programming Assessment

After installing and enabling the XBlock:

1. Open Open edX Studio.
2. Open the required course.
3. Navigate to the section and subsection where the assessment should appear.
4. Add a new component.
5. Select the registered Programming Assessment XBlock.
6. Open its configuration view.

### Instructor Configuration

The instructor can configure:

| Setting | Description |
|---|---|
| Question Title | Name of the programming question |
| Question Description | Problem statement |
| Selected Languages | Python, Java, and/or C++ |
| Starter Code | Initial code for selected languages |
| Visible Test Cases | Examples available to learners |
| Hidden Test Cases | Private evaluation test cases |
| Time Limit | Maximum execution time in seconds |
| Maximum Marks | Total marks available |

Save the configuration.

The configuration is stored in the XBlock content fields.

---

## 9. Learner Workflow

Once the assessment is published:

1. The learner opens the course unit.
2. The programming question is displayed.
3. The learner selects an available programming language.
4. The learner writes code in the Monaco Editor.
5. The learner clicks **Run** to request execution.
6. The learner clicks **Submit** to submit the solution for evaluation.
7. The result panel displays the response.

The current implementation uses mock responses. Actual execution and grading require the execution service.

---

## 10. XBlock Handlers

The XBlock exposes three JSON handlers.

| Handler | Purpose |
|---|---|
| `save_config` | Validates and saves instructor configuration |
| `run_code` | Receives learner code for execution |
| `submit_code` | Receives learner submissions for evaluation |

### Run Request

The frontend sends:

```json
{
  "language": "python",
  "code": "print(2 + 3)",
  "input": ""
}
```

The XBlock validates the request and passes it to the execution client.

### Submit Request

The frontend sends:

```json
{
  "question_id": "course-v1:example+course+2026",
  "language": "python",
  "code": "print(2 + 3)"
}
```

The XBlock validates the request and forwards it to the execution client.

> The question identifier and authorization checks should be strengthened as part of backend integration.

---

## 11. Execution Service Status

The current execution client is located at:

```text
xblock/programming_assessment/execution_client.py
```

It currently provides mock responses for Run and Submit.

The following functionality is pending:

- Actual Python execution.
- Java compilation and execution.
- C++ compilation and execution.
- Docker-based isolation.
- Execution timeouts and resource limits.
- Visible test-case evaluation.
- Hidden test-case evaluation.
- Automated scoring.
- Actual execution API integration.

### Important Security Requirement

Learner-submitted code must never be executed directly inside the Open edX LMS process.

The execution service must run code inside isolated environments with appropriate CPU, memory, time, filesystem, and network restrictions.

Hidden test cases must remain on the server and must never be exposed to the learner's browser.

---

## 12. Development and Build

### Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Build XBlock Package

```bash
cd xblock
python -m pip install --upgrade build
python -m build
```

The generated distribution files are placed in:

```text
xblock/dist/
```

### Run Frontend Development Server

```bash
cd frontend
npm run dev
```

For Open edX integration testing, use the Tutor environment with the XBlock installed and its production assets collected by Open edX.

---

## 13. Project Responsibilities

| Member | Responsibility |
|---|---|
| Member 1 | React frontend and programming interface |
| Member 2 | XBlock development and Open edX integration |
| Member 3 | Execution backend, Docker isolation, test evaluation, scoring, and API integration |

---

## 14. Current Development Status

| Feature | Status |
|---|---|
| React programming interface | Implemented |
| Monaco code editor | Implemented |
| Language selection | Implemented |
| XBlock integration | Implemented |
| Studio configuration | Implemented |
| Configuration persistence | Implemented |
| Run and Submit handlers | Implemented |
| Mock execution responses | Implemented |
| Actual code execution | Pending |
| Docker sandbox | Pending |
| Automated test evaluation | Pending |
| Actual scoring | Pending |

---

## 15. Security Considerations

- Do not execute learner code inside the Open edX application process.
- Use isolated execution containers.
- Enforce execution time and resource limits.
- Keep hidden test cases server-side.
- Validate incoming requests on the server.
- Do not rely solely on browser-side copy/paste restrictions.
- Validate submissions against the correct assessment instance.

---

## 16. Documentation and Contribution

Refer to `TASK_LOG.md` for development progress and task updates.

Contributions should be submitted through feature branches and Pull Requests so that changes can be reviewed before merging into the main branch.
