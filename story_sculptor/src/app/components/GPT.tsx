import React, { useState, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import "./styles.css"

interface GPTProps {
  content: string;
}

const GPT = ({ content }: GPTProps) => {
  const [visibleContent, setVisibleContent] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // Add one character from `content` to `visibleContent` on each interval
      setVisibleContent((prevVisibleContent) => content.substring(0, prevVisibleContent.length + 1));
    }, 50); // Adjust the interval duration (in milliseconds) for typing speed

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className='h-fit w-full flex flex-col items-end px-4 mb-2'>
      <div className="w-full text-right text-lg font-semibold">GPT</div>
      <ReactMarkdown
        className="mt-1 w-full break-words text-lg prose-p:leading-relaxed text-right mr-4 ubuntu-bold"
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => <a {...props} style={{ color: "blue", fontWeight: "bold" }} />,
        }}
      >
        {visibleContent}
      </ReactMarkdown>
    </div>
  );
};

export default GPT;
