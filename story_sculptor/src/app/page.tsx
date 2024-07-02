"use client"

import { useRouter } from 'next/navigation';
import React from 'react'

const Home = () => {
  const router = useRouter();

  const navigateToChat = () => {
    router.push('/chat');
  };
  return (
    <div className='w-screen h-screen'>
      Homepage
      <div onClick={
        navigateToChat
      } className='bg-blue-300 p-4 w-fit cursor-pointer'>To New Chat</div>
    </div>
  )
}

export default Home
