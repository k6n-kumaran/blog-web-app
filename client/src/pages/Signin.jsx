import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import {signInFailure,signInStart,signInSuccess} from '../app/slice/userSlice.js'
import {useDispatch, useSelector} from 'react-redux'


const Signin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData,setFormData] = useState({
    username : "",
    email : "",
    password : ""
  })

  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState(false)

  const {loading, error : errorMsg} = useSelector((state) => state.user)

  const handleChange =(e) => {
    const {name,value} = e.target;

    setFormData((prev) => {
      return {
        ...prev,
        [name] : value
      }
    }) 
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
      // return setError("Please fill the required fields")
      return dispatch(signInFailure("Please fill the required fields"))
    }
    try {
      // setLoading(true)
      dispatch(signInStart())
      const res = await fetch('api/auth/signin', {
        method : "POST",
        headers : { 'Content-Type' : "application/json"},
        body : JSON.stringify(formData)
      })
      const data = await res.json();
       if (data.success === false) {
        // return setError(data.message)
        dispatch(signInSuccess(data.message))
       }
       
       if(res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
       }
      
    } catch (error) {    
      // setError(error.message)
      dispatch(signInFailure(error.message))
    } finally {
      
      setFormData({
        username : "",
        email : "",
        password : ""
       })
    }   
  }


  return (
    <div className=' min-h-[76vh] mt-20'>
      <div className='flex flex-col md:flex-row md:items-center p-3 mx-auto max-w-3xl gap-5'>
        {/* Left Logo bar */}
        <div className='flex-1'>
           <Link to={'/'} className=' text-4xl font-bold dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-blue-500
               via-blue-300 to-blue-100 rounded-lg text-black '>K6n's</span>Blog
            </Link>
            <p className='text-sm mt-5'>
               To post something you thought about , You have to signin in this blog. Enter the email and password to sign up.Have a good surf
            </p>
        </div>
        {/* Right Form container */}
        <div className=" flex-1">
        <form className='flex  flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Email' />
            <TextInput type='email' placeholder='Email' name='email'  value={formData.email} onChange={handleChange}/>
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password' placeholder='Password' name='password' value={formData.password} onChange={handleChange} />
          </div>
          <Button type='submit' gradientDuoTone={'purpleToBlue'}>
            {loading  ? <>
              <Spinner size={"sm"}  />
              <span className='pl-3'>Loading...</span>
            </> : "Sign In"}
          </Button>
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Don't have an account?</span>
          <Link to={'/signup'} className='text-blue-500'>Sign up</Link>
        </div>
           {
            errorMsg && (
              <Alert className=' mt-5 ' color={'failure'}>
                {errorMsg}
              </Alert>
            )
           }
        </div>
      </div>
    </div>
  )
}

export default Signin;