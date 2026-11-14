
import { useState } from "react";

const availableLanguages = [
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
];

const defaultStarterCode = {
  python: `def add(a, b):
    # Write your solution here
    pass

print(add(10, 20))`,

  java: `public class Main {
    public static void main(String[] args) {
        // Write your solution here
    }
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
};

function TestCaseSection({
  title,
  description,
  cases,
  onChange,
  onAdd,
  onRemove,
  type,
}) {
  return (
    <section className={`test-case-section ${type}-tests`}>
      <h3>{title}</h3>
      <p>{description}</p>

      {cases.map((testCase, index) => (
        <div className="test-case-card" key={testCase.id}>
          <div className="test-case-heading">
            <strong>Test Case {index + 1}</strong>

            <button
              type="button"
              onClick={() => onRemove(testCase.id)}
            >
              Remove
            </button>
          </div>

          <div className="form-group">
            <label htmlFor={`${type}-input-${testCase.id}`}>
              Input
            </label>

            <textarea
              id={`${type}-input-${testCase.id}`}
              rows={3}
              value={testCase.input}
              onChange={(event) =>
                onChange(testCase.id, "input", event.target.value)
              }
              placeholder="Enter test input..."
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${type}-output-${testCase.id}`}>
              Expected Output
            </label>

            <textarea
              id={`${type}-output-${testCase.id}`}
              rows={3}
              value={testCase.expectedOutput}
              onChange={(event) =>
                onChange(
                  testCase.id,
                  "expectedOutput",
                  event.target.value
                )
              }
              placeholder="Enter expected output..."
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={onAdd}>
        + Add {type === "visible" ? "Visible" : "Hidden"} Test Case
      </button>
    </section>
  );
}

function InstructorAuthoring() {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");

  const [selectedLanguages, setSelectedLanguages] = useState(["python"]);

  const [starterCode, setStarterCode] = useState(defaultStarterCode);

  const [visibleTests, setVisibleTests] = useState([
    { id: 1, input: "", expectedOutput: "" },
  ]);

  const [hiddenTests, setHiddenTests] = useState([
    { id: 1, input: "", expectedOutput: "" },
  ]);
const [timeLimit, setTimeLimit] = useState(120);
const [maxMarks, setMaxMarks] = useState(10);
const [formError, setFormError] = useState("");
const [savedConfiguration, setSavedConfiguration] = useState(null);

  const toggleLanguage = (language) => {
    setSelectedLanguages((previous) =>
      previous.includes(language)
        ? previous.filter((item) => item !== language)
        : [...previous, language]
    );
  };

  const handleStarterCodeChange = (language, value) => {
    setStarterCode((previous) => ({
      ...previous,
      [language]: value,
    }));
  };

  const updateTestCase = (setter, id, field, value) => {
    setter((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addTestCase = (setter) => {
    setter((previous) => [
      ...previous,
      {
        id: previous.length
          ? Math.max(...previous.map((item) => item.id)) + 1
          : 1,
        input: "",
        expectedOutput: "",
      },
    ]);
  };

  const removeTestCase = (setter, id) => {
    setter((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };
const handleSaveConfiguration = (event) => {
  event.preventDefault();
  setFormError("");
  setSavedConfiguration(null);

  const numericTimeLimit = Number(timeLimit);
  const numericMaxMarks = Number(maxMarks);

  if (!questionTitle.trim() || !questionDescription.trim()) {
    setFormError("Please enter the question title and description.");
    return;
  }

  if (selectedLanguages.length === 0) {
    setFormError("Please select at least one programming language.");
    return;
  }

  if (
    selectedLanguages.some(
      (language) => !starterCode[language]?.trim()
    )
  ) {
    setFormError("Please provide starter code for every selected language.");
    return;
  }

  if (
    visibleTests.length === 0 ||
    visibleTests.some(
      (test) => !test.input.trim() || !test.expectedOutput.trim()
    )
  ) {
    setFormError("Please complete all visible test cases.");
    return;
  }

  if (
    hiddenTests.length === 0 ||
    hiddenTests.some(
      (test) => !test.input.trim() || !test.expectedOutput.trim()
    )
  ) {
    setFormError("Please complete all hidden test cases.");
    return;
  }

  if (!Number.isInteger(numericTimeLimit) || numericTimeLimit < 1) {
    setFormError("Time limit must be a positive whole number.");
    return;
  }

  if (!Number.isInteger(numericMaxMarks) || numericMaxMarks < 1) {
    setFormError("Maximum marks must be a positive whole number.");
    return;
  }

  const configuration = {
    questionTitle: questionTitle.trim(),
    questionDescription: questionDescription.trim(),
    selectedLanguages: [...selectedLanguages],
    starterCode: Object.fromEntries(
      selectedLanguages.map((language) => [
        language,
        starterCode[language],
      ])
    ),
    visibleTests: visibleTests.map(({ id, ...test }) => test),
    hiddenTests: hiddenTests.map(({ id, ...test }) => test),
    timeLimit: numericTimeLimit,
    maxMarks: numericMaxMarks,
  };

  setSavedConfiguration(configuration);
};
  return (
    <div className="authoring-page">
      <div className="authoring-header">
        <h2>Create Programming Question</h2>
        <p>Configure a programming assessment for your course.</p>
      </div>

      <form
  className="authoring-form"
  onSubmit={handleSaveConfiguration}
>
        <div className="form-group">
          <label htmlFor="question-title">Question Title</label>

          <input
            id="question-title"
            type="text"
            placeholder="Example: Sum of Two Numbers"
            value={questionTitle}
            onChange={(event) => setQuestionTitle(event.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="question-description">
            Question Description
          </label>

          <textarea
            id="question-description"
            rows={5}
            placeholder="Explain the programming problem..."
            value={questionDescription}
            onChange={(event) =>
              setQuestionDescription(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Supported Programming Languages</label>

          <div className="language-options">
            {availableLanguages.map((language) => (
              <label key={language.id} className="language-option">
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language.id)}
                  onChange={() => toggleLanguage(language.id)}
                />
                <span>{language.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="starter-code-section">
          <h3>Starter Code Configuration</h3>
          <p>Provide initial code for each selected language.</p>

          {selectedLanguages.map((language) => (
            <div className="form-group" key={language}>
              <label htmlFor={`starter-${language}`}>
                {availableLanguages.find(
                  (item) => item.id === language
                )?.label} Starter Code
              </label>

              <textarea
                id={`starter-${language}`}
                className="starter-code-input"
                rows={10}
                spellCheck="false"
                value={starterCode[language]}
                onChange={(event) =>
                  handleStarterCodeChange(
                    language,
                    event.target.value
                  )
                }
              />
            </div>
          ))}
        </div>

        <TestCaseSection
          title="Visible Test Cases"
          description="These examples will be available to learners."
          type="visible"
          cases={visibleTests}
          onChange={(id, field, value) =>
            updateTestCase(setVisibleTests, id, field, value)
          }
          onAdd={() => addTestCase(setVisibleTests)}
          onRemove={(id) => removeTestCase(setVisibleTests, id)}
        />

        <TestCaseSection
          title="Hidden Test Cases"
          description="Private tests used during submission evaluation. Do not expose these to learners."
          type="hidden"
          cases={hiddenTests}
          onChange={(id, field, value) =>
            updateTestCase(setHiddenTests, id, field, value)
          }
          onAdd={() => addTestCase(setHiddenTests)}
          onRemove={(id) => removeTestCase(setHiddenTests, id)}
        />
<div className="assessment-settings">
  <h3>Assessment Settings</h3>

  <p>Configure the time limit and maximum marks.</p>

  <div className="settings-grid">
    <div className="form-group">
      <label htmlFor="time-limit">Time Limit (Seconds)</label>

      <input
        id="time-limit"
        type="number"
        min="1"
        step="1"
        value={timeLimit}
        onChange={(event) => setTimeLimit(event.target.value)}
        required
      />
      <small>Maximum execution time allowed.</small>
    </div>

    <div className="form-group">
      <label htmlFor="max-marks">Maximum Marks</label>

      <input
        id="max-marks"
        type="number"
        min="1"
        step="1"
        value={maxMarks}
        onChange={(event) => setMaxMarks(event.target.value)}
        required
      />
      <small>Total marks available for this question.</small>
    </div>
  </div>
</div>

{formError && (
  <div className="form-error" role="alert">
    ⚠️ {formError}
  </div>
)}

<div className="authoring-actions">
  <button type="submit" className="save-configuration-btn">
    Save Question Configuration
  </button>
</div>

      </form>

{savedConfiguration && (
  <section className="saved-configuration">
    <h3>Configuration Saved Successfully!</h3>

    <p>
      <strong>Question:</strong>{" "}
      {savedConfiguration.questionTitle}
    </p>

    <p>
      <strong>Languages:</strong>{" "}
      {savedConfiguration.selectedLanguages.join(", ")}
    </p>

    <p>
      <strong>Visible tests:</strong>{" "}
      {savedConfiguration.visibleTests.length}
    </p>

    <p>
      <strong>Hidden tests:</strong>{" "}
      {savedConfiguration.hiddenTests.length}
    </p>

    <p>
      <strong>Time limit:</strong>{" "}
      {savedConfiguration.timeLimit} seconds
    </p>

    <p>
      <strong>Maximum marks:</strong>{" "}
      {savedConfiguration.maxMarks}
    </p>

    <details>
      <summary>View complete configuration JSON</summary>
      <pre>
        {JSON.stringify(savedConfiguration, null, 2)}
      </pre>
    </details>
  </section>
)}

    </div>
  );
}

export default InstructorAuthoring;
