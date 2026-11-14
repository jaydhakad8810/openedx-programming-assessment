
import Editor from "@monaco-editor/react";

function CodeEditor({ language, code, onChange, onBlockedAction }) {
  const handleEditorMount = (editor) => {
    // Disable Monaco's right-click context menu.
    editor.updateOptions({
      contextmenu: false,
    });

    const editorNode = editor.getDomNode();

    // Block browser clipboard and drag-and-drop events.
    const blockBrowserEvent = (event) => {
      event.preventDefault();
      event.stopPropagation();

      onBlockedAction?.(event.type);
    };

    const blockedEvents = [
  "copy",
  "cut",
  "paste",
  "drop",
  "contextmenu"
];


    blockedEvents.forEach((eventName) => {
      editorNode?.addEventListener(
        eventName,
        blockBrowserEvent,
        true
      );
    });

    // Block keyboard shortcuts.
    const keyboardDisposable = editor.onKeyDown((event) => {
      const keyEvent = event.browserEvent;
      const key = keyEvent.key.toLowerCase();

      const modifier = keyEvent.ctrlKey || keyEvent.metaKey;

      let blockedAction = null;

      if (modifier && key === "c") blockedAction = "copy";
      if (modifier && key === "x") blockedAction = "cut";
      if (modifier && key === "v") blockedAction = "paste";

      if (keyEvent.ctrlKey && key === "insert") {
        blockedAction = "copy";
      }

      if (keyEvent.shiftKey && key === "insert") {
        blockedAction = "paste";
      }

      if (keyEvent.shiftKey && key === "delete") {
        blockedAction = "cut";
      }

      if (blockedAction) {
        event.preventDefault();
        event.stopPropagation();

        onBlockedAction?.(blockedAction);
      }
    });

    // Remove event handlers when the editor is destroyed.
    editor.onDidDispose(() => {
      blockedEvents.forEach((eventName) => {
        editorNode?.removeEventListener(
          eventName,
          blockBrowserEvent,
          true
        );
      });

      keyboardDisposable.dispose();
    });
  };

  return (
    <div className="code-editor">
      <Editor
        height="500px"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          contextmenu: false,
        }}
      />
    </div>
  );
}

export default CodeEditor;
