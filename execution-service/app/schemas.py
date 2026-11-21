from typing import Literal
from pydantic import BaseModel, Field, model_validator


Language = Literal["python", "java", "cpp"]
Action = Literal["run", "submit"]


class TestCase(BaseModel):
    stdin: str = ""
    expected_output: str


class ExecutionRequest(BaseModel):
    action: Action
    language: Language
    source_code: str = Field(min_length=1, max_length=50000)
    visible_tests: list[TestCase] = Field(default_factory=list, max_length=20)
    hidden_tests: list[TestCase] = Field(default_factory=list, max_length=50)
    time_limit_seconds: int = Field(default=2, ge=1, le=10)
    memory_limit_mb: int = Field(default=128, ge=32, le=512)

    @model_validator(mode="after")
    def validate_tests(self):
        if not self.visible_tests:
            raise ValueError("At least one visible test is required")
        if self.action == "submit" and not (
            self.visible_tests or self.hidden_tests
        ):
            raise ValueError("At least one test is required")
        return self


class TestResult(BaseModel):
    status: str
    passed: bool
    stdout: str = ""
    stderr: str = ""
    compile_output: str = ""
    execution_time_ms: int = 0


class ExecutionResponse(BaseModel):
    status: str
    passed_tests: int
    total_tests: int
    results: list[TestResult]
    message: str
