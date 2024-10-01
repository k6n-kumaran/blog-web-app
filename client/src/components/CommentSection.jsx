import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {Alert, Button, Textarea} from 'flowbite-react'

const CommentSection = ({postId}) => {

    const {currentUser} = useSelector((state) => state.user)
    const [comment,setComment] = useState('')
    const [error,setError] = useState(null)


    const handleSubmit = async(e) => {
        e.preventDefault()
        if(comment.length >200) {
            return;
        }

        try {
              const res = await fetch('/api/comment/createcomment', {
            method : "POST",
            headers : {
                "Content-Type" :  "application/json"
            },
            body : JSON.stringify({content : comment , postId, userId : currentUser._id})
        })

        const data = await res.json();

        if(res.ok) {
            setComment('')
            setError(null)
        }
        } catch (error) {
           setError(error.message) 
        }
      
    }
  return (
    <div className='max-w-2xl w-full mx-auto p-3'>
        {currentUser ? (
            <div className='flex items-center gap-1 text-gray-400 text-xs'>
                <p>Signed in as</p>
                <img className='w-5 h-5 object-cover rounded-full' src={currentUser.photo} alt="UserPic" />
                <Link to={'/dashboard?tab=profile'}
                className='text-cyan-600 hover:underline'>@{currentUser.username}</Link>
            </div>
        ) : (
            <div className='flex items-center gap-1 text-gray-400 text-xs'>
                <p>You have to sign in to comment</p>
                <Link to={'/signin'}  className='text-cyan-600 hover:underline'>Sign in</Link>
            </div>
        )}

        {currentUser && (
            <form onSubmit={handleSubmit}className='border border-teal-200 rounded-md p-3' >
                <Textarea 
                placeholder='Add a comment...'
                rows='3'
                className=' resize-none'
                maxLength={200} 
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                />
                <div className='flex items-center justify-between mt-5 '>
                    <p>{200 - comment.length} characters remaining</p>
                    <Button outline type='submit'  gradientDuoTone={'purpleToBlue'}>Submit</Button>
                </div>
                {error && <Alert color={'failure'} className='mt-5'>
                    {error}
                </Alert>}
            </form>
        )}
    </div>
  )
}

export default CommentSection