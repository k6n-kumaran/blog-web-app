import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'
import {useSelector} from 'react-redux'

const Comment = ({comment,like,onDelete}) => {

    const [user,setUser] = useState({})
    const {currentUser} = useSelector((state) => state.user)
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json();
                if(res.ok) {
                    setUser(data)
                }
                
            } catch (error) {
                console.log(error.message);
                
            }
        }

        getUserData()
    },[comment])


   
  return (
    <div className='flex p-4 border-b dark:border-gray-600'>
        <div className='flex-shrink-0 mr-3'>
            <img
            className='w-10 h-10 object-cover rounded-full' 
            src={user.photo} alt="userpic" />
        </div>
        <div className='flex-1'>
            <div className='flex items-center mb-4'>
                <span className=' font-bold mr-1  truncate text-xs'>{user ? `@${user.username}` : "Anonymous user"}</span>
                <span className='text-gray-400 text-xs'>{moment(comment?.createdAt).fromNow()}</span>
            </div>
            <p className=' text-gray-500  pb-2'>{comment?.content}</p>
            <div>
                <button type='button' onClick={() => like(comment?._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment?.likes.includes(currentUser._id) && "text-blue-500"}`}>
                    <FaThumbsUp className='text-sm'/>
                </button>
                <button type='button' onClick={() => onDelete(comment._id)} className={`text-gray-400 hover:text-red-500`}>
                    Delete
                </button>
            </div>
        </div>
        
    </div>
  )
}

export default Comment