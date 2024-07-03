"use client"

import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import "../globals.css"
import CompHandler from '../components/CompHandler'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
const SUPABASE_URL = "https://msrtvvrxipekveyghgwu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zcnR2dnJ4aXBla3ZleWdoZ3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1NTQyNDcsImV4cCI6MjAzNTEzMDI0N30.iSYldNBVqsOQB9EQEvpylwHKoyHdiboXsKnI5jLxojI"
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface PromptPayload {
  payload: {
    type: string;
    prompt: string | { prompt: string, schemaAttr: string } | string[]
  }
}


const ChatPage = () => {
  const [prompt, setPrompt] = useState<string>("");
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
      setPromptHistory((prevPrompts) => {
        if (payload.new.payload.type === 'GPT') {
          const lastPrompt = prevPrompts[prevPrompts.length - 1];
          return lastPrompt?.payload.type === 'GPT'
            ? [...prevPrompts.slice(0, prevPrompts.length - 1), payload.new]
            : [...prevPrompts, payload.new];
        } else {
          return prevPrompts;
        }
      })
    }
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
    return <div>Loading the data!!!</div>
  }

  return (
    <main className="home">
      <div id="Header">
        <h1 className="text-4xl font-bold mb-4 ubuntu-bold">Story Sculptor</h1>
      </div>
      <div id="Content Generation Area" className="relative bg-slate-600 flex-1 border-white rounded-xl w-5/6 flex flex-col overflow-auto hide-scrollbar p-4  border-2">
        {promptHistory.length === 0 && <div className='w-full h-96 flex items-center justify-center'>No data Available</div>}
          <div className='border-2 border-white bg-black px-4 justify-center'>{promptHistory.length > 0 && promptHistory?.map((item, index) => <CompHandler payload={item.payload} key={index} />)}</div>
          <div ref={messagesEndRef} />
      </div>
      <div id="Input Prompter" className="w-4/6 min-h-12 flex flex-row rounded-full overflow-hidden border-2 border-black focus:border-none">
        <input
          className="shared-input rounded-l-full p-3 text-black"
          placeholder='Ask your query....'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendCurrentPrompt()}
        />
        <ArrowCircleRight onClick={sendCurrentPrompt} className="h-12 w-10 p-1  bg-blue-400 hover:bg-blue-700 rounded-r-full" />
      </div>
    </main>
  )
}

export default ChatPage
