"use client"

import Head from 'next/head';
import Link from 'next/link';
import { redirect, RedirectType, useRouter } from 'next/navigation';
import React from 'react'
import './styles.css'
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import logo from "../../../public/assets/Story.png"
import camera from "../../../public/assets/camera.jpg"
import butterfly from "../../../public/assets/butterfly.png"


const mockUseCases = [
  {
    heading: "Aspiring Writers and Filmmakers",
    content: "Helps writers and filmmakers develop their story ideas into detailed outlines or scripts by providing them visuals of key scenes involved in the movie."
  },
  {
    heading: "Educational Purposes",
    content: "Assists students in creative writing classes to quickly generate and refine story ideas."
  },
  {
    heading: "Content Creators",
    content: "Assists influencers in creating compelling storylines for their content and helps content creators develop scripts and storyboards for their videos or audio productions."
  },
  {
    heading: "Marketing and Advertising",
    content: "Assists marketing teams in developing story-driven advertising campaigns and brand storytelling helps in creating compelling brand stories that resonate with target audiences."
  },
  {
    heading: "Professional Screenwriters",
    content: "Helps screenwriters quickly draft and refine scripts and pitch preparation assists in preparing detailed story outlines and visual aids for pitching to studios or investors."
  },
  {
    heading: "Game Designers",
    content: "Assists game designers in crafting engaging storylines and character arcs for their games and world-building provides tools for developing intricate worlds and settings for games."
  },
];

const mockPricing = [
  {
    heading: "Free",
    tag: "Starter",
    duration: "Trial",
    credits: "5 credits",
    tagline: "5 images of Movie Poster or Script Allowed",
  },
  {
    heading: "Medium Package",
    tag: "Intermediate",
    duration: "1 week",
    credits: "25 credits",
    tagline: "25 images of Movie Poster or Script Allowed",
  },
  {
    heading: "Advanced Package",
    tag: "Advanced",
    duration: "1 month",
    credits: "50 credits",
    tagline: "50 images of Movie Poster or Script Allowed",
  },
];

const Home = () => {
  const router = useRouter();
  const navigateToChat = () => {
    router.push('/chat');
  };

  const navigateToProfile = () => {
    router.push('/profile');
  }

  const navigateToPricing = () => {
    router.push('/credits');
  }

  return (
    <div className='min-h-screen w-screen bg-gray-100'>
      <div className='h-fit w-full py-4 px-8'>
        {/* Header */}
        <header className='w-full h-14 flex flex-row justify-between gap-8 bg-white text-black rounded-full overflow-hidden shadow-md border-t-[1px] border-x-[1px]'>
          <Image src={logo} alt='logo' height={500} width={500} className='h-full items-center' />
          <div className='h-full w-full flex flex-row justify-between items-center p-2 ubuntu-sans-normal'>
            <p onClick={navigateToChat} className='hover:text-blue-700 cursor-pointer'>Try It</p>
            <Link href={'#section1'} className='hover:text-blue-700 cursor-pointer'>How It Works</Link>
            <Link href={'#section2'} className='hover:text-blue-700 cursor-pointer'>Use Cases</Link>
            <Link href={'#section3'} className='hover:text-blue-700 cursor-pointer'>Video Demo</Link>
            <Link href={'#section4'} className='hover:text-blue-700 cursor-pointer'>Pricing</Link>
            <p onClick={navigateToChat} className='p-2 bg-purple-400 m-2 cursor-pointer rounded-full'>Get Subscription</p>
            <UserButton/>
          </div>
        </header>

        <div className='h-16 w-full' />

        {/* Hero Section */}
        <section className='h-fit w-full ubuntu-regular flex flex-row gap-4 justify-evenly px-16'>
          {/* Contains the details about Headline and Subheadline */}
          <div className='flex-1 text-black flex-col flex h-96 justify-center gap-4'>
            <p className='text-4xl ubuntu-bold'>Craft Your Imagination into Cinematic Masterpieces. Fast.</p>
            <p className='text-md text-slate-400'>Transform Your Ideas into Engaging Short Films with Our AI-Powered Storytelling Platform</p>
            <p onClick={navigateToChat} className='p-2 bg-purple-400 cursor-pointer w-fit m-2 rounded-full'>Get Subscription</p>
          </div>
          {/* Simple vintage photo */}
          <div className='h-96 flex flex-1 items-center justify-center'>
            <div className='w-full justify-center flex'>
              <Image src={butterfly} alt='moon' height={500} width={500} className='w-4/6 scale-100' />
            </div>
          </div>
        </section>

        <div className='h-16 w-full' />

        {/* How it works Section */}
        <section id='section1' className='min-h-screen w-full text-black ubuntu-light'>
          <div className='flex flex-col px-8'>
            <p className='w-full justify-center flex font-bold text-3xl'>How does it work?</p>
            <div className='h-16' />
            <div className='flex-col flex w-full gap-16'>
              {/* Greet the Application */}
              <div className='flex flex-row h-60 items-center justify-center  gap-16'>
                <div className='w-96 h-48 flex-1 flex justify-end'>
                  <Image src={camera} alt='moon' className='h-60 w-96  rounded-3xl' />
                </div>
                <div className='flex-1 flex'><p className='w-1/2 text-lg'>Provide your thoughts in terms of Movie Title, Genre, Theme, Tone, Setting Place, Plot Summary and Characters involoved in the movie to be precise according to your requirements.</p></div>
              </div>

              {/* Type your ideal movie with the following details: Movie Name */}
              <div className='flex flex-row h-60 items-center justify-center  gap-16'>
                <div className='flex-1 flex justify-end pt-4'><p className='w-1/2 text-lg'>Let AI sculpt your narrative, generating scenes and dialogues dynamically, and generating a final script.</p></div>
                <div className='w-96 h-48 flex-1'>
                  <Image src={camera} alt='moon' className='h-60 w-96  rounded-3xl' />
                </div>
              </div>

              {/* Model will generate the movie posters and your movie scenes alongwith some basic script */}
              <div className='flex flex-row h-60 items-center justify-center gap-16'>
                <div className='w-96 h-48 flex-1  flex justify-end'>
                  <Image src={camera} alt='moon' className='h-60 w-96  rounded-3xl' />
                </div>
                <div className='flex-1 flex pt-4'><p className='w-1/2 text-lg'>Finally, Image generation model will help to construct Movie Poster and Movie Scipted scenes which user can download as images.</p></div>
              </div>
            </div>
          </div>
        </section>

        <div className='h-28 w-full' />

        {/* Use Cases */}
        <section id='section2' className='min-h-full w-full text-black'>
          <div className='flex flex-col px-8'>
            <p className='w-full justify-center flex font-bold text-3xl'>Use Cases</p>
            <div className='h-8' />
            <div className='w-full flex items-center justify-center'>
              <div className='flex flex-wrap gap-4 justify-evenly'>
                {mockUseCases.map((item, index) => {
                  return <div key={index} className='h-fit bg-white w-80 shadow-md flex flex-col rounded-xl p-2'>
                    <p className='text-blue-700 ubuntu-sans-normal text-lg'>{item.heading}</p>
                    <p className='ubuntu-regular'>{item.content}</p>
                  </div>
                })}
              </div>
            </div>
          </div>
        </section>

        <div className='h-28 w-full' />

        {/* Video Demo */}
        <section id='section3' className='text-black ubuntu-sans-normal'>
          <div className='flex flex-col px-8'>
            <p className='w-full justify-center flex font-bold text-3xl'>Video Demo</p>
            <div className='h-8' />
          </div>
        </section>

        <div className='h-28 w-full' />

        {/* Pricing Section */}
        <section id='section4' className='min-h-screen w-full text-black  ubuntu-sans-normal'>
          <div className='flex flex-col px-8'>
            <p className='w-full justify-center flex font-bold text-3xl'>Pricing</p>
            <div className='h-8' />
            <div className='w-full flex flex-row gap-2'>
              {mockPricing.map((item, index)=>{
                return <div key={index} className='w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y'>
                  <div className="pt-[15px] px-[25px] pb-[25px]">
                  <div className="flex justify-end">
                    <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                      <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                        {item.tag}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                      {item.duration}
                    </p>
                    <p className="text-[#00153B] text-[35px] leading-[63px] font-bold">
                      {item.heading}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                      {item.credits}
                    </p>
                    <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                      1 User
                    </p>
                  </div>
                </div>

                <div className="pt-[25px] px-[25px] pb-[35px]">
                  <div>
                    <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                      {item.tagline}
                    </p>
                  </div>

                  <div className="mt-[25px]">
                    <button onClick={navigateToPricing} className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">Subscribe</button>
                  </div>
                </div>
                </div>
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
  }

export default Home
