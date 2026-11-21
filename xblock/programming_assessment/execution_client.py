"""HTTP client for the isolated Open edX code execution service."""

import os

import requests

EXECUTION_SERVICE_URL = os.getenv(
    "EXECUTION_SERVICE_URL",
    "http://172.18.0.1:8000",
).rstrip("/")

REQUEST_TIMEOUT = (3, 30)


def _convert_tests(test_cases):
    """Convert XBlock test cases into Execution Service format."""
    return [
        {
            "stdin": test["input"],
            "expected_output": test["expectedOutput"],
        }
        for test in test_cases
    ]


def _call_execution_service(payload):
    """Send a request to the isolated execution service."""
    response = requests.post(
        f"{EXECUTION_SERVICE_URL}/api/v1/execute",
        json=payload,
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    return response.json()


def run_code(language, code, user_input="", visible_tests=None, time_limit=2):
    """Run code against visible tests only."""
    tests = visible_tests or [
        {"input": user_input, "expectedOutput": ""}
    ]

    try:
        result = _call_execution_service({
            "action": "run",
            "language": language,
            "source_code": code,
            "visible_tests": _convert_tests(tests),
            "time_limit_seconds": min(max(int(time_limit), 1), 10),
        })

        first = result.get("results", [{}])[0]

        return {
            "status": first.get("status", result.get("status", "internal_error")),
            "output": first.get("stdout", ""),
            "error": (
                first.get("compile_output")
                or first.get("stderr")
                or None
            ),
            "execution_time": first.get("execution_time_ms", 0),
            "message": result.get("message", ""),
        }

    except requests.RequestException:
        return {
            "status": "internal_error",
            "output": "",
            "error": "Execution service is unavailable. Please try again.",
            "execution_time": 0,
            "message": "Could not connect to the execution service.",
        }


def submit_code(
    question_id,
    language,
    code,
    visible_tests,
    hidden_tests,
    time_limit=2,
    max_score=10,
):
    """Evaluate code against visible and hidden tests."""
    try:
        result = _call_execution_service({
            "action": "submit",
            "language": language,
            "source_code": code,
            "visible_tests": _convert_tests(visible_tests),
            "hidden_tests": _convert_tests(hidden_tests),
            "time_limit_seconds": min(max(int(time_limit), 1), 10),
        })

        passed = result.get("passed_tests", 0)
        total = result.get("total_tests", 0)
        score = round(max_score * passed / total, 2) if total else 0

        return {
            "status": result.get("status", "partial"),
            "passed": passed,
            "total": total,
            "score": score,
            "message": result.get("message", "Submission evaluated."),
        }

    except requests.RequestException:
        return {
            "status": "internal_error",
            "passed": 0,
            "total": 0,
            "score": 0,
            "message": "Execution service is unavailable. Please try again.",
        }
