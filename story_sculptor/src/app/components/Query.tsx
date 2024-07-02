import React from 'react'

interface QueryProps {
    content: string
}

const Query = ({content}:QueryProps) => {
  return (
    <div className='h-fit w-full flex flex-col px-4'>
      <p>User</p>
      <p>{content}</p>
    </div>
  )
}

export default Query
