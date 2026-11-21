# Open edX Programming Assessment – Execution Service

A FastAPI-based execution service for the Open edX Programming Assessment XBlock. It runs Python, Java, and C++ submissions in isolated Docker containers and evaluates visible and hidden test cases.

## Features

- Supports Python 3, Java 17, and C++17.
- Executes code using Docker containers.
- Evaluates visible test cases during Run.
- Evaluates visible and hidden test cases during Submit.
- Compares program output with expected output.
- Reports compilation errors, runtime errors, timeouts, and test results.
- Applies container resource and isolation restrictions.

## Technology Stack

- Python 3.12
- FastAPI and Uvicorn
- Pydantic
- Docker
- Java 17
- G++ with C++17
- Pytest

## Architecture

1. The Open edX XBlock sends source code and test cases to the execution API.
2. FastAPI validates the request.
3. A temporary workspace is created for the submission.
4. Docker executes the program inside an isolated container.
5. Standard output, errors, execution time, and exit status are captured.
6. Output is compared with the expected result.
7. The API returns the evaluation summary and visible test results.

## Project Structure

```text
execution-service/
├── app/
│   ├── main.py
│   ├── schemas.py
│   └── routes/
│       └── submissions.py
├── runners/
│   └── docker_runner.py
├── tests/
│   └── test_execution.py
├── Dockerfile
├── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.12 or compatible Python environment
- Docker Engine installed and running
- Permission to access the Docker daemon
- Git

## Setup and Installation

Run the following commands from the `execution-service` directory.

### 1. Create a virtual environment (optional)

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Build the code execution image

```bash
docker build -t openedx-code-runner:1.0 .
```

This image contains Python, OpenJDK 17, and G++ and is used to execute submitted programs.

### 4. Start the FastAPI service

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will be available at:

- API base URL: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

Keep Docker and the execution service running while processing submissions.

## API Reference

### Health Check

**GET** `/health`

Example response:

```json
{
  "status": "healthy",
  "service": "execution-service"
}
```

### Execute Code

**POST** `/api/v1/execute`

#### Example request

```json
{
  "action": "run",
  "language": "python",
  "source_code": "a, b = map(int, input().split())\nprint(a + b)",
  "visible_tests": [
    {
      "stdin": "10 20",
      "expected_output": "30"
    },
    {
      "stdin": "5 7",
      "expected_output": "12"
    }
  ],
  "hidden_tests": [],
  "time_limit_seconds": 2,
  "memory_limit_mb": 128
}
```

#### Example response

```json
{
  "status": "accepted",
  "passed_tests": 2,
  "total_tests": 2,
  "results": [
    {
      "status": "success",
      "passed": true,
      "stdout": "30\n",
      "stderr": "",
      "compile_output": "",
      "execution_time_ms": 25
    },
    {
      "status": "success",
      "passed": true,
      "stdout": "12\n",
      "stderr": "",
      "compile_output": "",
      "execution_time_ms": 24
    }
  ],
  "message": "2 of 2 tests passed"
}
```

Execution times in this example are illustrative.

## Supported Languages

| Language | API value | Runtime |
|---|---|---|
| Python | `python` | Python 3 |
| Java | `java` | Java 17 |
| C++ | `cpp` | G++ with C++17 |

Java submissions must define their entry point in `Main.java` using a `Main` class.

## Run and Submit Behaviour

| Action | Test cases executed |
|---|---|
| `run` | Visible test cases |
| `submit` | Visible and hidden test cases |

Hidden test case details are not included in the API response. The response contains the aggregate passed and total test counts.

## Request Validation and Limits

- Source code: 1–50,000 characters.
- Visible test cases: maximum 20.
- Hidden test cases: maximum 50.
- At least one visible test case is required.
- Execution time limit: 1–10 seconds.
- Memory limit: 32–512 MB.
- Default time limit: 2 seconds.
- Default memory limit: 128 MB.

## Docker Execution Isolation

The execution runner applies container restrictions including:

- Network access disabled (`--network none`).
- Read-only container filesystem.
- Memory and CPU limits.
- Process count limit.
- File size limit.
- Linux capabilities dropped.
- No-new-privileges security option.
- Temporary workspace mounted for the submitted program.
- Temporary filesystem for runtime operations.

These controls provide isolation for submitted code, but do not by themselves constitute a complete production security review.

## Running Tests

From the `execution-service` directory:

```bash
pytest -v
```

The test suite is located in `tests/test_execution.py`.

## Open edX XBlock Integration

The execution service is called by the Programming Assessment XBlock through its execution client.

The XBlock uses the following endpoint:

```text
POST http://<execution-service-host>:8000/api/v1/execute
```

Configure the service URL using the `EXECUTION_SERVICE_URL` environment variable when required. The client has a default URL configured in its implementation.

The execution service must be reachable from the Open edX LMS environment, and the Docker image must be available to the machine running the service.

## Error Handling

The execution service reports statuses such as:

- `success`
- `compilation_error`
- `runtime_error`
- `wrong_answer`
- `time_limit_exceeded`
- `memory_limit_exceeded`
- `internal_error`

The overall response status is `accepted` when all evaluated tests pass and `partial` otherwise.

## Limitations and Deployment Notes

- Docker must be installed and accessible to the execution service.
- The execution runner uses the local Docker image `openedx-code-runner:1.0`.
- The service currently has no authentication or rate-limiting layer.
- Production deployment should include authentication, request rate limiting, monitoring, and further security testing.
- The execution service and XBlock must be configured to communicate over a reachable network.

## License

Apache License 2.0. See the repository's `LICENSE` file.
