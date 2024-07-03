import React from 'react'

interface QueryProps {
    content: string
}

const Query = ({content}:QueryProps) => {
  console.log("Skibidi")
  return (
    <div className='h-fit w-full flex flex-col px-4 py-2'>
      <p className='text-lg font-semibold'>User</p>
      <p className='ml-4'>{content}</p>
    </div>
  )
}

export default Query
