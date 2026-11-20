# Open edX Programming Assessment – Execution Service

## Overview
A FastAPI-based service that executes Python, Java, and C++ submissions in isolated Docker containers and evaluates visible and hidden test cases.

## Technologies
- Python
- FastAPI and Uvicorn
- Docker
- Java 17
- C++17
- Pytest

## Architecture
1. XBlock/backend sends source code and test cases.
2. FastAPI validates the request.
3. A temporary workspace is created.
4. Docker executes code in an isolated container.
5. Output, errors, execution time, and exit status are captured.
6. Output is compared with expected output.
7. API returns the evaluation result.

## Supported Languages
- Python
- Java
- C++

## Setup

### Install dependencies
```bash
pip install -r requirements.txt
