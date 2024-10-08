import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import Oauth from '../components/Oauth';


const Signup = () => {

  const navigate = useNavigate();

  const [formData,setFormData] = useState({
    username : "",
    email : "",
    password : ""
  })

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

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
    if (!formData.username || !formData.email || !formData.password) {
      return setError("Please fill the required fields")
    }
    try {
      setLoading(true)
      const res = await fetch('api/auth/signup', {
        method : "POST",
        headers : { 'Content-Type' : "application/json"},
        body : JSON.stringify(formData)
      })
      const data = await res.json();
       if (data.success === false) {
        return setError(data.message)
       }
       setLoading(false);
       if(res.ok) {
        navigate('/signin')
       }
      
    } catch (error) {    
      setError(error.message)
    } finally {
      setLoading(false); 
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
               To post something you thought about , You have to sign up in this blog. Enter the username,email and password to sign up.Have a good surf
            </p>
        </div>
        {/* Right Form container */}
        <div className=" flex-1">
        <form className='flex  flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Username' />
            <TextInput type='text' placeholder='Username' name='username'  value={formData.username}  onChange={handleChange}/>
          </div>
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
            </> : "Sign Up"}
          </Button>
          <Oauth />
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Have an account?</span>
          <Link to={'/signin'} className='text-blue-500'>Sign in</Link>
        </div>
           {
            error && (
              <Alert className=' mt-5 ' color={'failure'}>
                {error}
              </Alert>
            )
           }
        </div>
      </div>
    </div>
  )
}

export default Signup