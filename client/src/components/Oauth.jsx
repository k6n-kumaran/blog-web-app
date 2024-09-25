import { Button } from 'flowbite-react'
import React from 'react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import {useDispatch} from 'react-redux'
import {signInSuccess} from '../app/slice/userSlice.js'
import {useNavigate} from 'react-router-dom'

const Oauth = () => {

    const dispatch= useDispatch()
    const navigate = useNavigate();
    const handleOauth =async () => {
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({prompt :'select_account'})
        
        try {
            const result = await signInWithPopup(auth,provider)
            const response = await fetch('api/auth/google',{
                method : "POST",
                headers : {'Content-Type' : "application/json"},
                body : JSON.stringify({
                    name : result.user.displayName,
                    email : result.user.email,
                    photoURL : result.user.photoURL
                })
            })
            const data = await response.json();

            if(response.ok){
                dispatch(signInSuccess(data))
                navigate('/')
            }
            
            
            
        } catch (error) {
            console.log(error);
            
        }
    }
  return (
    <Button type='button' gradientDuoTone={'pinkToOrange'} outline onClick={handleOauth}>
    <AiFillGoogleCircle  className='w-5 h-5 mr-1'/> 
    Continue with Google
    </Button>
  )
}

export default Oauth