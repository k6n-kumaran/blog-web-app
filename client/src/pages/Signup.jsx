import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className=' min-h-screen mt-20'>
      <div className='flex flex-col md:flex-row md:items-center p-3 mx-auto max-w-3xl gap-5'>
      {/* Left Logo bar */}
        <div className='flex-1'>
           <Link to={'/'} className=' text-4xl font-bold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-blue-500
               via-blue-300 to-blue-100 rounded-lg text-black '>K6n's</span>Blog
            </Link>
            <p className='text-sm mt-5'>
               To post something you thought about , You have to sign up in this blog. Enter the username,email and password to sign up.Have a good surf
            </p>
        </div>
      {/* Right Form container */}
        <div className=" flex-1">
        <form className='flex  flex-col gap-4'>
          <div>
            <Label value='Username' />
            <TextInput type='text' placeholder='Username' id='username' />
          </div>
          <div>
            <Label value='Email' />
            <TextInput type='email' placeholder='Email' id='email' />
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password' placeholder='Password' id='password' />
          </div>
          <Button type='submit' gradientDuoTone={'purpleToBlue'}>Sign Up</Button>
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Have an account?</span>
          <Link to={'/sign-in'} className='text-blue-500'>Sign in</Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Signup