
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
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
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [output, setOutput] = useState("Your output will appear here.");

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage]);
    setOutput("Language changed. Ready to run.");
  };

  const handleRun = () => {
    setOutput("Execution service is not connected yet.");
  };

  const handleSubmit = () => {
    setOutput("Submission service is not connected yet.");
  };

  return (
    <div className="app">
      <header className="header">
        <h2>Programming Assessment</h2>
        <span>Practice Exam</span>
      </header>

      <main className="workspace">
        <section className="question">
          <h3>Question 1: Sum of Two Numbers</h3>
          <p>Write a program to calculate and print the sum of two numbers.</p>
        </section>

        <section className="editor-section">
          <div className="toolbar">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <div className="actions">
              <button onClick={handleRun}>Run</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>

          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
          />
        </section>

        <section className="result">
          <h3>Output / Results</h3>
          <pre>{output}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
