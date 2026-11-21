from fastapi import APIRouter
from app.schemas import ExecutionRequest, ExecutionResponse, TestResult
from runners.docker_runner import execute_code

router = APIRouter()


def normalize_output(output: str) -> str:
    return "\n".join(line.rstrip() for line in output.strip().splitlines())


@router.post("/execute", response_model=ExecutionResponse)
def execute_submission(request: ExecutionRequest):
    visible_tests = request.visible_tests
    hidden_tests = request.hidden_tests if request.action == "submit" else []
    all_tests = visible_tests + hidden_tests

    results = []
    passed = 0

    for index, test in enumerate(all_tests):
        execution = execute_code(
            language=request.language,
            source_code=request.source_code,
            stdin=test.stdin,
            time_limit=request.time_limit_seconds,
            memory_limit=request.memory_limit_mb,
        )

        is_passed = (
            execution["status"] == "success"
            and normalize_output(execution["stdout"])
            == normalize_output(test.expected_output)
        )

        if is_passed:
            passed += 1

        status = execution["status"]
        if status == "success" and not is_passed:
            status = "wrong_answer"

        # Return detailed results only for visible tests.
        if index < len(visible_tests):
            results.append(TestResult(
                status=status,
                passed=is_passed,
                stdout=execution.get("stdout", ""),
                stderr=execution.get("stderr", ""),
                compile_output=execution.get("compile_output", ""),
                execution_time_ms=execution.get("execution_time_ms", 0),
            ))

        if status in (
            "compilation_error",
            "runtime_error",
            "time_limit_exceeded",
            "memory_limit_exceeded",
            "internal_error",
        ):
            break

    total = len(all_tests)
    overall = "accepted" if passed == total else "partial"

    return ExecutionResponse(
        status=overall,
        passed_tests=passed,
        total_tests=total,
        results=results,
        message=f"{passed} of {total} tests passed",
    )
