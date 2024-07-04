import React from 'react'
import "./styles.css"

interface QueryProps {
    content: string
}

const Query = ({content}:QueryProps) => {
  return (
    <div className='h-fit w-full flex flex-col px-4 py-2'>
      <p className='text-lg font-semibold'>User</p>
      <p className='ml-4 ubuntu-medium'>{content}</p>
    </div>
  )
}

export default Query
