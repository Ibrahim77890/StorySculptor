import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

interface GPTProps {
    content: string
}

const GPT = ({content}: GPTProps) => {
  console.log("Skibidi")
  return (
    <div className='h-fit w-full flex flex-col items-end px-4'>
  <div className="w-full text-right text-lg font-semibold">GPT</div>
  <ReactMarkdown
    className="mt-1 w-full break-words text-lg prose-p:leading-relaxed text-right mr-4"
    remarkPlugins={[remarkGfm]}
    components={{
      a: ({ node, ...props }) => <a {...props} style={{ color: "blue", fontWeight: "bold" }} />,
    }}
  >
    {content}
  </ReactMarkdown>
</div>

  )
}

export default GPT
