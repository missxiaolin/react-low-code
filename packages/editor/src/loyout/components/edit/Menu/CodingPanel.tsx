import { Row } from "antd";
import Editor, { loader } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import { usePageStore } from "@/stores/pageStore";

/**
 * 代码面板
 */
const CodingPanel = () => {
  const editorRef = useRef<any>(null);
  const { theme, page } = usePageStore((state) => state);

  // 初始化monaco，默认为jsdelivery分发，由于网络原因改为本地cdn
  loader.config({
    paths: {
      vs: `${window.location.origin}/static/monaco-editor/min/vs`,
    },
  });

  function handleEditorDidMount(editor: { getValue: () => string }) {
    editorRef.current = editor;
    editorRef.current?.setValue(JSON.stringify({ page }, null, 2));
  }

  useEffect(() => {
    editorRef.current?.setValue(JSON.stringify({ page }, null, 2));
  }, [page]);

  return (
    <Row style={{ marginLeft: "-14px", marginRight: 1 }}>
      <Editor
        height="calc(100vh - 170px)"
        language="json"
        theme={theme === "dark" ? "vs-dark" : "vs-light"}
        options={{
          lineNumbers: "on",
          minimap: {
            enabled: false,
          },
        }}
        onMount={handleEditorDidMount}
      />
    </Row>
  );
};

export default CodingPanel;
