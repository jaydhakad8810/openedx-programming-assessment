from app.schemas import ExecutionRequest
from app.routes.submissions import normalize_output


def test_python_request_is_valid():
    request = ExecutionRequest(
        action="run",
        language="python",
        source_code="print(1 + 1)",
        visible_tests=[{"stdin": "", "expected_output": "2"}],
    )
    assert request.language == "python"


def test_java_request_is_valid():
    request = ExecutionRequest(
        action="run",
        language="java",
        source_code="public class Main {}",
        visible_tests=[{"expected_output": ""}],
    )
    assert request.language == "java"


def test_cpp_request_is_valid():
    request = ExecutionRequest(
        action="run",
        language="cpp",
        source_code="int main() { return 0; }",
        visible_tests=[{"expected_output": ""}],
    )
    assert request.language == "cpp"


def test_output_normalization():
    assert normalize_output("  Hello  \nWorld  \n") == "Hello\nWorld"


def test_invalid_language_is_rejected():
    from pydantic import ValidationError

    try:
        ExecutionRequest(
            action="run",
            language="javascript",
            source_code="console.log(1)",
            visible_tests=[{"expected_output": "1"}],
        )
        assert False, "Invalid language should be rejected"
    except ValidationError:
        pass
