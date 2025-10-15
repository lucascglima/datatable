/**
 * Code Editor Component
 * Editor de código usando Monaco Editor (VS Code)
 */

import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Spin } from 'antd';

const CodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  height = '300px',
  readOnly = false,
  theme = 'vs-dark',
  options = {},
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configurar validação para JavaScript
    if (language === 'javascript') {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
      });
    }
  };

  const handleChange = (newValue) => {
    if (onChange && !readOnly) {
      onChange(newValue || '');
    }
  };

  const defaultOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    readOnly: readOnly,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    ...options,
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      theme={theme}
      options={defaultOptions}
      loading={
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Spin size="large" tip="Carregando editor..." />
        </div>
      }
    />
  );
};

export default CodeEditor;
