
const statusLabels = {
  idle: "Waiting",
  running: "Running",
  success: "Executed Successfully",
  compile_error: "Compilation Error",
  runtime_error: "Runtime Error",
  timeout: "Time Limit Exceeded",
  submitted: "Submission Completed",
  incorrect: "Incorrect Answer",
  partial: "Partially Correct",
};

function ResultPanel({ result }) {
  const {
    status = "idle",
    output = "",
    error = "",
    passedTests,
    totalTests,
    marks,
    maxMarks,
    message = "Run your code to see the output here.",
  } = result || {};

  return (
    <section className="result">
      <div className="result-header">
        <h3>Execution Results</h3>

        <span className={`result-status status-${status}`}>
          {statusLabels[status] || "Unknown Status"}
        </span>
      </div>

      {message && <p>{message}</p>}

      {output && (
        <div className="result-output">
          <h4>Program Output</h4>
          <pre>{output}</pre>
        </div>
      )}

      {error && (
        <div className="result-error">
          <h4>Error Details</h4>
          <pre>{error}</pre>
        </div>
      )}

      {passedTests != null && totalTests != null && (
        <div className="test-summary">
          <h4>Test Results</h4>
          <p>
            {passedTests}/{totalTests} test cases passed
          </p>
        </div>
      )}

      {marks != null && maxMarks != null && (
        <div className="score-summary">
          <h4>Score</h4>
          <p>
            {marks}/{maxMarks} marks
          </p>
        </div>
      )}
    </section>
  );
}

export default ResultPanel;
