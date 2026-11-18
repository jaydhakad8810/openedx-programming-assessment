"""
Temporary execution client for Programming Assessment XBlock.

This module provides mock responses for Member 2 integration testing.
Member 3 will replace these methods with actual execution-service calls.

Student code must never be executed inside Open edX.
"""


def run_code(language, code, user_input=""):
    """Return a mock response for the Run operation."""

    return {
        "status": "success",
        "output": "[MOCK] Execution service is not connected yet.",
        "error": None,
        "execution_time": 0,
        "mock": True,
    }


def submit_code(question_id, language, code):
    """Return a mock response for the Submit operation."""

    return {
        "status": "evaluated",
        "passed": 0,
        "total": 0,
        "score": 0,
        "message": "[MOCK] Test evaluation is not connected yet.",
        "mock": True,
    }
