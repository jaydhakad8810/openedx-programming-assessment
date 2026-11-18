
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import ResultPanel from "./components/ResultPanel";
import "./App.css";

const defaultStarterCode = {
  python: `def add(a, b):
    return a + b

print(add(10, 20))`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println(10 + 20);
    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << 10 + 20 << endl;
    return 0;
}`
};


  function App({ config = {} }) {
  const selectedLanguages =
    Array.isArray(config.selectedLanguages) &&
    config.selectedLanguages.length > 0
      ? config.selectedLanguages
      : ["python"];

  const availableStarterCode = {
    ...defaultStarterCode,
    ...(config.starterCode || {})
  };

  const initialLanguage = selectedLanguages[0];


  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(
    availableStarterCode[initialLanguage] || ""
  );
    const [restrictionNotice, setRestrictionNotice] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [result, setResult] = useState({
    status: "idle",
    message: "Run your code to see the output here."
  });

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(availableStarterCode[newLanguage] || "");

    setResult({
      status: "idle",
      message: "Language changed. Ready to run."
    });
  };
  const handleBlockedAction = (action) => {
    const actionNames = {
      copy: "Copying",
      cut: "Cutting",
      paste: "Pasting",
      drop: "Drag-and-drop text insertion",
      contextmenu: "Right-click context menu"
    };

    const actionName = actionNames[action] || "This action";

    setRestrictionNotice(
      `${actionName} is disabled during this examination.`
    );
  };

  const getCsrfToken = () => {
    const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : "";
  };

  const postToXBlock = async (url, payload) => {
    if (!url) {
      throw new Error("XBlock handler URL is missing.");
    }

    const csrfToken = getCsrfToken();

    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {})
      },
      body: JSON.stringify(payload)
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.error || data.message || `Request failed (${response.status}).`
      );
    }

    return data;
  };

  const handleRun = async () => {
    if (isRunning || isSubmitting) return;

    setIsRunning(true);
    setResult({
      status: "running",
      message: "Sending code to the XBlock..."
    });

    try {
      const data = await postToXBlock(config.runUrl, {
        language,
        code,
        input: ""
      });

      setResult({
        status: data.status || "success",
        output: data.output || "",
        error: data.error || "",
        message: data.message || (
          data.mock
            ? "Mock response received. Actual code execution is not connected yet."
            : "Run request completed."
        )
      });
    } catch (error) {
      setResult({
        status: "runtime_error",
        error: error.message,
        message: "Unable to process the Run request."
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isRunning || isSubmitting) return;

    setIsSubmitting(true);
    setResult({
      status: "running",
      message: "Sending your submission to the XBlock..."
    });

    try {
      const data = await postToXBlock(config.submitUrl, {
        question_id: config.questionId,
        language,
        code
      });

      const passed = Number(data.passed || 0);
      const total = Number(data.total || 0);

      setResult({
        status: total > 0 && passed < total ? "partial" : "submitted",
        passedTests: passed,
        totalTests: total,
        marks: Number(data.score || 0),
        maxMarks: Number(config.maxScore || 0),
        message: data.message || "Submission response received."
      });
    } catch (error) {
      setResult({
        status: "runtime_error",
        error: error.message,
        message: "Unable to process the Submit request."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h2>Programming Assessment</h2>
      </header>

      <main className="workspace">
        <section className="question">
              <h3>Question 1: Sum of Two Numbers</h3>
              <p>
                Write a program to calculate and print the sum
                of two numbers.
              </p>
            </section>

            <section className="editor-section">
              {restrictionNotice && (
                <div
                  className="restriction-warning"
                  role="alert"
                  aria-live="assertive"
                >
                  <span>⚠️ {restrictionNotice}</span>

                  <button
                    type="button"
                    onClick={() => setRestrictionNotice("")}
                    aria-label="Dismiss warning"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="toolbar">
                <select
                  value={language}
                  onChange={(event) =>
                    handleLanguageChange(event.target.value)
                  }
                  disabled={isRunning || isSubmitting}
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>

                <div className="actions">
                  <button
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                  >
                    {isRunning ? "Running..." : "Run"}
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              <CodeEditor
                language={language}
                code={code}
                onChange={setCode}
                onBlockedAction={handleBlockedAction}
              />
            </section>

        <ResultPanel result={result} />
      </main>
    </div>
  );
}

export default App;
