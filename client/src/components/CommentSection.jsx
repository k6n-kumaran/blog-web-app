import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Link, parsePath} from 'react-router-dom'
import {Alert, Button, Modal, Textarea} from 'flowbite-react'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const CommentSection = ({postId}) => {

    const {currentUser} = useSelector((state) => state.user)
    const [comment,setComment] = useState('')
    const [error,setError] = useState(null)
    const [comments,setComments] = useState([])
    const [showModel,setShowModel] = useState(false)
    const [commentDelete,setCommentDelete] = useState(null)



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
            setComments([data, ...comments])
        }
        } catch (error) {
           setError(error.message) 
        }
      
    }
 
    

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`);
                if(res.ok) {
                    const data = await res.json();
                    setComments(data)
                }
                
            } catch (error) {
                console.log(error.message);
                
            }
        }

        fetchComments()
    },[postId])

    const handleLikes = async (commentId) => {
        try {
            if(!currentUser) {
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`, {
                method: "PUT",
            })

            if(res.ok) {
                const data = await res.json()
                setComments(comments.map(( comment ) => {
                    comment._id  === commentId ? (
                        {
                            ...comment,
                            likes : data.likes,
                            numberOfLikes : data.likes.length
                        }
                    ) : comment
                }))
            }
        } catch (error) {
            console.log(error.message);
            
        }
    }

    const handleDelete =  async(commentId) => {
        setShowModel(false)
        try {
            const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
                method : "DELETE"
            })
            if(res.ok){
                const data = await res.json();
                setComments(comments.filter((comment) => comment._id !== commentId))
            }

        } catch (error) {
           console.log(error.message);
            
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

        {comments.length === 0 ? (
            <p className=' text-sm my-5'>No comments yet.</p>
        ) : (
            <>
               <div className='flex items-center gap-1 my-4'>
                <p>Comments</p>
                <div className=''>
                    <p>{comments.length}</p>
                </div>
               </div> 

               {comments.map((comment,index) => {
                return <Comment key={index} comment={comment} like={handleLikes} 
                onDelete={(commentId)=> {
                    setShowModel(true)
                    setCommentDelete(commentId)
                    }}/>
               })}
            </>
            
        )}
        <Modal show={showModel} onClose={() => setShowModel(false)} popup size={'md'}>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className=' h-14 w-14 mx-auto text-gray-400 dark:text-green-200 mt-4' />
            <h3 className='text-md mb-5 text-gray-400 dark:text-gray-200'>Are you sure to delete your comment?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={() => handleDelete(commentDelete)}>
                Yes,I'm sure
              </Button>
              <Button color={'gray'} onClick={() => setShowModel(false)}>
                No,Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection