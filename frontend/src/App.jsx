
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import ResultPanel from "./components/ResultPanel";
import InstructorAuthoring from "./components/InstructorAuthoring";
import "./App.css";

const starterCode = {
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

function App() {
  const [activeView, setActiveView] = useState("learner");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);

  const [restrictionNotice, setRestrictionNotice] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [result, setResult] = useState({
    status: "idle",
    message: "Run your code to see the output here."
  });

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage]);

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

  const handleRun = () => {
    if (isRunning || isSubmitting) return;

    setIsRunning(true);

    setResult({
      status: "running",
      message: "Running your code (demo)..."
    });

    window.setTimeout(() => {
      setResult({
        status: "success",
        output: "30",
        message: "Demo execution completed. Actual code execution is not connected yet."
      });

      setIsRunning(false);
    }, 1200);
  };

  const handleSubmit = () => {
    if (isRunning || isSubmitting) return;

    setIsSubmitting(true);

    setResult({
      status: "running",
      message: "Submitting your solution (demo)..."
    });

    window.setTimeout(() => {
      setResult({
        status: "partial",
        passedTests: 4,
        totalTests: 5,
        message: "Demo submission completed. Actual test evaluation is not connected yet."
      });

      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="app">
      <header className="header">
        <h2>Programming Assessment</h2>

        <div className="view-switcher">
          <button
            type="button"
            className={activeView === "learner" ? "active" : ""}
            onClick={() => setActiveView("learner")}
          >
            Learner View
          </button>

          <button
            type="button"
            className={activeView === "instructor" ? "active" : ""}
            onClick={() => setActiveView("instructor")}
          >
            Instructor View
          </button>
        </div>
      </header>

      <main className="workspace">
        {activeView === "instructor" ? (
          <InstructorAuthoring />
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;
