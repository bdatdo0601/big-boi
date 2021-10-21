// import { basicSetup } from "@codemirror/basic-setup";
import { lineNumbers } from '@codemirror/gutter';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { plSQL } from '@codemirror/legacy-modes/mode/sql';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { EditorState } from '@codemirror/state';
import { StreamLanguage } from '@codemirror/stream-parser';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import React, { useEffect, useRef } from 'react';

const getLanguage = (className) => {
  // https://github.com/codemirror/legacy-modes
  const lang = className ? className.replace(`language-`, '') : null;
  switch (lang) {
    case 'javascript':
    case 'js':
      return javascript();
    case 'json':
      return json();
    case 'css':
      return css();
    case 'html':
      return html();
    case 'dockerfile':
      return StreamLanguage.define(dockerFile);
    case 'sh':
    case 'bash':
    case 'service':
    case 'shell':
      return StreamLanguage.define(shell);
    case 'sql':
    case 'plsql':
    case 'pl/sql':
      return StreamLanguage.define(plSQL);
    case 'yaml':
    case 'yml':
      return StreamLanguage.define(yaml);
    default:
      if (lang) {
        console.warn(
          `Unhandeled language in CodeMirror ${lang}. Fallback to default JavaScript`
        );
      }
      return javascript();
  }
};

const CodeMirror = ({ children, className }) => {
  const editorParentRef = useRef();
  const editorRef = useRef();

  const language = getLanguage(className);

  // Initilize view
  useEffect(() => {
    if (editorRef.current === undefined) {
      const FontSizeTheme = EditorView.theme({
        '&': {
          fontSize: '14px',
        },
      });

      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: children,
          extensions: [
            lineNumbers(),
            language,
            oneDark,
            FontSizeTheme,
            EditorView.editable.of(false),
          ],
        }),
        parent: editorParentRef.current,
        lineWrapping: true,
      });
    }
  }, [editorRef, editorParentRef, children, language]);

  return (
    <div
      id="codemirror-editor-wrapper"
      className="max-w-full"
      ref={editorParentRef}
    />
  );
};

export default CodeMirror;
