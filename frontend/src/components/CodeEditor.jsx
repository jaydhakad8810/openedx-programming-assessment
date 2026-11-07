import Editor from "@monaco-editor/react";

function CodeEditor({ language, code, onChange }) {
  return (
    <div className="code-editor">
      <Editor
        height="500px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
        }}
      />
    </div>
  );
}

export default CodeEditor;
