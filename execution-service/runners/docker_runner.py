import os
import subprocess
import tempfile
import time
from pathlib import Path

IMAGE = "openedx-code-runner:1.0"
MAX_OUTPUT = 65536

COMMANDS = {
    "python": (
        "main.py",
        "python3 -m py_compile main.py || exit 42; exec python3 main.py",
    ),
    "java": (
        "Main.java",
        "javac Main.java || exit 42; exec java -Xmx64m Main",
    ),
    "cpp": (
        "main.cpp",
        "g++ -std=c++17 -O2 -pipe main.cpp -o main || exit 42; exec ./main",
    ),
}


def execute_code(language, source_code, stdin="", time_limit=2, memory_limit=128):
    if language not in COMMANDS:
        return {"status": "internal_error", "stdout": "", "stderr": "Unsupported language"}

    filename, command = COMMANDS[language]
    command = command.replace("exec ", f"timeout --signal=KILL {time_limit}s ")
    start = time.monotonic()

    try:
        with tempfile.TemporaryDirectory(prefix="code-job-") as temp:
            job_dir = Path(temp)
            (job_dir / filename).write_text(source_code, encoding="utf-8")
            os.chmod(job_dir, 0o777)

            docker_command = [
                "docker", "run", "--rm", "-i",
                "--network", "none",
                "--read-only",
                "--memory", f"{memory_limit}m",
                "--memory-swap", f"{memory_limit}m",
                "--cpus", "1",
                "--pids-limit", "64",
                "--ulimit", "fsize=1048576:1048576",
                "--cap-drop", "ALL",
                "--security-opt", "no-new-privileges",
                "--user", f"{os.getuid()}:{os.getgid()}",
                "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
                "--mount", f"type=bind,src={job_dir},dst=/workspace",
                "--workdir", "/workspace",
                IMAGE,
                "sh", "-c", command,
            ]

            result = subprocess.run(
                docker_command,
                input=stdin,
                text=True,
                capture_output=True,
                timeout=time_limit + 5,
                check=False,
            )

            elapsed = int((time.monotonic() - start) * 1000)
            stdout = result.stdout[:MAX_OUTPUT]
            stderr = result.stderr[:MAX_OUTPUT]

            if result.returncode == 42:
                status = "compilation_error"
            elif result.returncode == 137 and "Killed" in stderr and elapsed < time_limit * 1000:
                status = "memory_limit_exceeded"
            elif result.returncode == 124 or (result.returncode == 137 and "Killed" in stderr):
                status = "time_limit_exceeded"
            elif result.returncode != 0:
                status = "runtime_error"
            else:
                status = "success"

            return {
                "status": status,
                "stdout": stdout,
                "stderr": stderr,
                "compile_output": stderr if status == "compilation_error" else "",
                "execution_time_ms": elapsed,
                "exit_code": result.returncode,
            }

    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit_exceeded",
            "stdout": "",
            "stderr": "Execution exceeded the time limit",
            "compile_output": "",
            "execution_time_ms": int((time.monotonic() - start) * 1000),
        }
    except Exception:
        return {
            "status": "internal_error",
            "stdout": "",
            "stderr": "Execution service failed",
            "compile_output": "",
            "execution_time_ms": int((time.monotonic() - start) * 1000),
        }
