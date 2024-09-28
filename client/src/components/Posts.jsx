import React, { useEffect, useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Button, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const Posts = () => {

  const {currentUser} = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore , setShowMore] = useState(true)
  const [showModal , setShowModal] = useState(false)
  const [postId , setPostId] = useState(null)



  const fetchPosts = async () => {
    try {
      const res =await fetch(`/api/post/posts?userId=${currentUser._id}`)
      const data = await res.json();
      if(res.ok) {
        setUserPosts(data.posts)
        if(data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
   if(currentUser.isAdmin) {
    fetchPosts()
   }
  },[currentUser._id])

  const handleDelete = async() => {
    setShowModal(false) 
    try {
      const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {
        method : "DELETE",
      })

      const data = await res.json();

      if(!res.ok) {
        console.log(data.message);
      } else{
        setUserPosts((prev) => {
          prev.filter((post) => post._id !== postId)
        })
        fetchPosts()
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleShowMore = async() => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/posts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await  res.json();

      if(res.ok) {
        setUserPosts((prev) => [...prev,...data.posts])
        if(data.posts.length<9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  console.log(userPosts);
  
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin  && userPosts?.length > 0 ? (
        <div >
          <Table hoverable className='shadow-md  w-full'>
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post Image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>

            {userPosts.map((post,index) => {
              return  <TableBody key={index}>
              <TableRow  >
               <TableCell>
                {new Date(post.createdAt).toLocaleDateString()}
               </TableCell>
               <TableCell>
                 <Link to={`/post/${post.slud}`}>
                   <img src={post.photo} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                 </Link>
               </TableCell>
               <TableCell className='text-gray-600 dark:text-white  font-medium'>
                {post.title}
               </TableCell>
               <TableCell className='text-gray-600 dark:text-white  font-medium'>
                {post.category}
               </TableCell>
               <TableCell>
                <span onClick={() => {
                  setShowModal(true)
                  setPostId(post._id)
                }} className='font-medium cursor-pointer text-red-600 hover:underline'>Delete</span>
               </TableCell>
               <TableCell>
               <Link to={`/update/${post._id}`} className='text-teal-400'>
                 <span>Edit</span>
               </Link>
                
               </TableCell>
              </TableRow>
            </TableBody>
            })}
           
          </Table>
          {showMore && (
            <div className='flex items-center justify-center mt-2'>
              <button onClick={handleShowMore} className=' text-teal-400 font-medium'>Show More</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>There is no post</p>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className=' h-14 w-14 mx-auto text-gray-400 dark:text-green-200 mt-4' />
            <h3 className='text-md mb-5 text-gray-400 dark:text-gray-200'>Are you sure to delete your post?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={handleDelete}>
                Yes,I'm sure
              </Button>
              <Button color={'gray'} onClick={() => setShowModal(false)}>
                No,Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Posts