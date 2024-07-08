import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (<div className='min-h-screen w-screen flex justify-center items-center bg-slate-400'>
    <SignUp/>
  </div>)
}

export default SignUpPage
