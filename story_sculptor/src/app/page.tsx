"use client"

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const Home = () => {
  const router = useRouter();

  const navigateToChat = () => {
    router.push('/chat');
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <Head>
        <title >StorySculptor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-center px-64">
        <h1 className="text-4xl font-bold mb-4 ubuntu-bold">Story Sculptor</h1>
        <p className="text-lg mb-8">
          A random movie generator web application where you provide specific details about your movie ideas,
          and watch them come to life as short movies with stunning illustrations and text overlays.
        </p>
      </main>

      <Link href="/chat">
        <div className="absolute bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Go to Chats
        </div>
      </Link>
    </div>
  )
}

export default Home
