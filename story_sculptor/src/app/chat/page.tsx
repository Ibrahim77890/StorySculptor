"use client"

import { ArrowCircleRight } from '@phosphor-icons/react/dist/ssr'
import React, { useState } from 'react'
import "../globals.css"
import CompHandler from '../components/CompHandler'
import { headers } from 'next/headers'

const mockdata = [
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
  {
    message: {
      type: 'Query',
      content: 'What is your name?'
    },
  },
  {
    message: {
      type: 'GPT',
      content: 'Nothing Special'
    }
  },
]

const ChatPage = () => {
  const [prompt, setPrompt] = useState<string>("")

  const sendCurrentPrompt = async() => {
    const message = prompt
    const body  =JSON.stringify({message})
    setPrompt("")

    try {
      const response = await fetch('api/backend', {
        method: 'POST',
        body,
        headers: {
        'Content-Type': 'application/json'
      }});

      if(!response.ok){
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json()
      console.log(data);
      
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <main className="home">
      <div id="Header">
        <p className="heading font-sans">Story Sculptor</p>
      </div>
      <div id="Content Generation Area" className="bg-transparent flex-1 border-white border-2 border-dashed rounded-xl w-full flex flex-col overflow-auto py-4">
        {mockdata?.map((item, index) => <CompHandler payload={item} sendPayload={() => { }} key={index} />)}
      </div>
      <div id="Input Prompter" className="w-4/6 min-h-12 flex flex-row rounded-full overflow-hidden border-2 border-black focus:border-none">
        <input className="shared-input rounded-l-full p-3 text-black" onSubmit={sendCurrentPrompt} />
        <ArrowCircleRight onClick={sendCurrentPrompt} className="h-12 w-10 p-1  bg-blue-400 hover:bg-blue-700 rounded-r-full" />
      </div>
    </main>
  )
}

export default ChatPage
