// __mocks__/react-markdown.js
import React from "react";

// Simple passthrough mock for react-markdown
export default function ReactMarkdown({ children }) {
  return <div>{children}</div>;
}
