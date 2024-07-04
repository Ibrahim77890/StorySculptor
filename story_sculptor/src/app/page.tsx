"use client"

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import './components/styles.css'
import { motion } from "framer-motion";

const Home = () => {
  const router = useRouter();

  const navigateToChat = () => {
    router.push('/chat');
  };
  return (
    <div className="flex items-center justify-center h-screen bg-skull bg-cover">
      <Head>
        <title >StorySculptor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
      className='h-10 w-10 border-2 border-white mr-8 bg-opacity-20 bg-transparent bg-blue-400'
      animate={{
        scale: [1, 2, 2, 1, 1],
        rotate: [0, 0, 180, 180, 0],
        borderRadius: ["0%", "0%", "50%", "50%", "0%"]
      }}
      transition={{
        duration: 2,
        ease: "circInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1
      }}
    ></motion.div>

      <div className="text-center px-16 border-[4px] border-white w-4/6 h-fit flex items-center justify-start flex-col rounded-3xl bg-opacity-20 bg-transparent bg-blue-400">
        <div className='w-full h-full'><div className='w-2/6 h-10 mb-8 border-b-black border-x-black -translate-y-[1px] border-2 rounded-b-lg bg-white relative flex flex-row gap-4 items-center pl-4'><div className='w-4 h-4 bg-red-600 rounded-full'/><div className='w-4 h-4 bg-yellow-600 rounded-full'/><div className='w-4 h-4 bg-green-600 rounded-full'/></div>
        <h2 className="text-5xl font-bold mb-4 ubuntu-bold black-stroke heading-text">Story Sculptor</h2>
        <p className="text-2xl mb-8 ubuntu-sans-normal font-extrabold">
          A random movie generator web application where you provide specific details about your movie ideas,
          and watch them come to life as short movies with stunning illustrations and text overlays.
        </p></div>
      </div>

      <motion.div
      className='h-10 w-10 border-2 border-white ml-8 bg-opacity-20 bg-transparent bg-blue-400'
      animate={{
        scale: [1, 2, 2, 1, 1],
        rotate: [0, 0, 180, 180, 0],
        borderRadius: ["0%", "0%", "50%", "50%", "0%"]
      }}
      transition={{
        duration: 2,
        ease: "circInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1
      }}
    ></motion.div>

      <div onClick={navigateToChat}>
        <div className="absolute bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
          Go to Chats
        </div>
      </div>
    </div>
  )
}

export default Home
