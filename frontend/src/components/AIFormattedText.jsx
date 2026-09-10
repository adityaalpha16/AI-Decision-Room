import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function AIFormattedText({ children, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-7">
              {children}
            </p>
          ),

          strong: ({ children }) => (
            <strong className="font-semibold text-gray-200">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-gray-300">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="my-2 ml-5 list-disc space-y-1.5">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-2 ml-5 list-decimal space-y-1.5">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          h1: ({ children }) => (
            <h1 className="mb-2 text-base font-semibold text-gray-200">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-2 text-base font-semibold text-gray-200">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-1.5 text-sm font-semibold text-gray-200">
              {children}
            </h3>
          ),

          code: ({ children }) => (
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-blue-300">
              {children}
            </code>
          ),
        }}
      >
        {String(children || "")}
      </ReactMarkdown>
    </div>
  );
}

export default AIFormattedText;