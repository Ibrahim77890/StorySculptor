import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (<div className='min-h-screen w-screen flex justify-center items-center bg-slate-400'>
    <SignIn />
  </div>
  )
}

export default SignInPage
