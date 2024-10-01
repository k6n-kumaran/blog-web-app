import React, { useEffect, useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Button, Modal, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck,FaTimes } from 'react-icons/fa'


const Users = () => {

  const {currentUser} = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [showMore , setShowMore] = useState(true)
  const [showModal , setShowModal] = useState(false)
  const [userId , setUserId] = useState(null)



  const fetchUsers = async () => {
    try {
      const res =await fetch(`/api/user/getusers`)
      const data = await res.json();
      if(res.ok) {
        setUsers(data.users)
        if(data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
   if(currentUser.isAdmin) {
    fetchUsers()
   }
  },[currentUser._id])

  const handleDelete = async() => {
    setShowModal(false) 
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method : "DELETE",
      })

      const data = await res.json();

      if(!res.ok) {
        console.log(data.message);
      } else{
        setUsers((prev) => {
          prev.filter((user) => user._id !== userId)
        })
        fetchUsers()
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  const handleShowMore = async() => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`)
      const data = await  res.json();

      if(res.ok) {
        setUsers((prev) => [...prev,...data.users])
        if(data.users.length<9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }

  
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin  && users?.length > 0 ? (
        <div >
          <Table hoverable className='shadow-md  w-full'>
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User Image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>

            {users.map((user,index) => {
              return  <TableBody key={index}>
              <TableRow  >
               <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
               </TableCell>
               <TableCell>
                 <Link to={`/post/${user._id}`}>
                   <img src={user.photo} alt={user.title} className='w-20 h-10 object-cover bg-gray-500' />
                 </Link>
               </TableCell>
               <TableCell className='text-gray-600 dark:text-white  font-medium'>
                {user.username}
               </TableCell>
               <TableCell className='text-gray-600 dark:text-white  font-medium'>
                {user.email}
               </TableCell>
               <TableCell className='text-gray-600 dark:text-white  font-medium'>
                {user.isAdmin ? <FaCheck className='text-green-500'/> : <FaTimes className='text-red-500'/>}
               </TableCell>
               <TableCell>
                <span onClick={() => {
                  setShowModal(true)
                  setUserId(user._id)
                }} className='font-medium cursor-pointer text-red-600 hover:underline'>Delete</span>
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
          <p>There is no user yet</p>
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

export default Users