import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate ,Outlet } from 'react-router-dom'

const AdminRoute = () => {

    const {currentUser} = useSelector((state)=> state.user)
  return  <div>
    {currentUser.isAdmin ? <Outlet /> : <Navigate to={'/signin'} />}
  </div>
}

export default AdminRoute