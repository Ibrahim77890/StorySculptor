"use client"

import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import "../components/styles.css"
import CompHandler from '../components/CompHandler'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import ImageCompHandler from '../components/ImageCompHandler'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'


const SUPABASE_URL = "https://msrtvvrxipekveyghgwu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnR2dnJ4aXBla3ZleWdoZ3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1NTQyNDcsImV4cCI6MjAzNTEzMDI0N30.iSYldNBVqsOQB9EQEvpylwHKoyHdiboXsKnI5jLxojI"
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



interface PromptPayload {
  payload: {
    type: string;
    prompt: string | { prompt: string, schemaAttr: string } | {script: string, imageUrl: string}[]
  }
}


const ChatPage = () => {

  const {user,isSignedIn} = useUser();
  
  useEffect(()=>{
    if(!isSignedIn){
      redirect("/sign-in")
    }
  },[isSignedIn])

  if (!user) redirect("/sign-in");

  // const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  // const [chatId, setChatId] = useState<string>("");
  const messagesEndRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [promptHistory, setPromptHistory] = useState<PromptPayload[]>([]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [promptHistory]);


  useEffect(() => {

    const handlePromptInserts = (payload: { new: PromptPayload }) => {
      if (!payload.new || !payload.new.payload) {
        console.error("Invalid payload:", payload);
        return;
      }

      setPromptHistory((prevPrompts) => {
        const newPrompt = payload.new;
        if (newPrompt.payload.type === 'GPT' || newPrompt.payload.type === 'Query' || newPrompt.payload.type === 'GPTImages') {
          const lastPrompt = prevPrompts[prevPrompts.length - 1];
          return [...prevPrompts, newPrompt];
        } else {
          return prevPrompts;
        }
      });
    };

    const subscription =
      supabase
        .channel("chat_history")
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "chat_history"
        },
          handlePromptInserts)
        .subscribe()

      supabase.from('chat_history').select('*').order("created_at", { ascending: true }).then(({ data, error }) => {
      if (error) {
        console.log("Error fetching data:", error);
      } else {
        setPromptHistory(data || []);
        setIsLoading(false);
      }
    })
    return () => { subscription.unsubscribe(); }
  }, []);


  const sendCurrentPrompt = async () => {
    const message = prompt
    const body = JSON.stringify({ message })
    setPrompt("")

    try {
      const response = await fetch('api/backend', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json()
      console.log(data);

    } catch (error) {
      console.log("error", error);
    }
  }

  if (isLoading) {
    return <main className="home h-screen w-full flex items-center justify-center font-semibold text-4xl bg-castle bg-cover bg-center"><div>Loading resources!!!</div></main>
  }

  return (
    <main className="home bg-castle bg-cover bg-center">
      <div className='flex flex-row gap-4 w-full h-full'>
        {/* Left container */}
        <div className="text-center px-4 border-[4px] border-white w-full h-[600px] hide-scrollbar flex items-center justify-start flex-col rounded-3xl overflow-auto bg-slate-400 bg-opacity-20">
          <div className='w-full h-full relative'>
            <div className='w-full absolute h-10 border-b-black border-x-black -translate-y-[1px] border-2 rounded-b-lg bg-white e flex flex-row gap-4 items-center pl-4'>
              <div className='w-4 h-4 bg-red-600 rounded-full' />
              <div className='w-4 h-4 bg-yellow-600 rounded-full' />
              <div className='w-4 h-4 bg-green-600 rounded-full' />
            </div>
            <h2 className="text-3xl font-bold mb-4 ubuntu-bold heading-text mt-16 ">Story Sculptor</h2>
            <h2 className="text-xl font-bold mb-4 ubuntu-bold heading-text ">Images of Movie</h2>
            <div className='h-full w-full justify-center overflow-auto hide-scrollbar bg-transparent flex-1 text-[#ffffff]'>
              {promptHistory.length === 0  && <p>Waiting for user request</p>}
              {promptHistory.length > 0 && promptHistory?.map((item, index) => <ImageCompHandler payload={item.payload} key={index} />)}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Right Container */}
        <div className='px-4 border-[4px] border-white w-full h-[600px] rounded-3xl overflow-auto relative bg-slate-400 bg-opacity-20'>
          <div id="Input Prompter" className="w-full my-8 min-h-12 flex flex-row rounded-full overflow-auto border-[1px] border-black">
            <input
              className="shared-input rounded-l-full p-3 text-black placeholder:text-black"
              placeholder='Ask your query....'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendCurrentPrompt()}
            />
            <ArrowCircleRight onClick={sendCurrentPrompt} className="h-12 w-10 p-1  bg-black hover:bg-slate-800 rounded-r-full" />
          </div>
          <div id="Content Generation Area" className="relative h-[400px] flex-1 rounded-xl w-full hide-scrollbar flex flex-col hide-scrollbar overflow-auto">
            {promptHistory.length === 0 && <div className='w-full h-[400px] hide-scrollbar flex items-center justify-center text-[#2e2311]'>Break the ice...</div>}
            <div className='justify-center overflow-auto hide-scrollbar text-[#2e2311] font-bold'>{promptHistory.length > 0 && promptHistory?.map((item, index) => <CompHandler payload={item.payload} key={index} />)}</div>
            <div ref={messagesEndRef} />
          </div>
        </div>
      <div>
        <UserButton/>
      </div>
      </div>
    </main>
  )
}



export default ChatPage
