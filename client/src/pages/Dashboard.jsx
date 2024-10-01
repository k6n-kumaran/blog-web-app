import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardProfile from '../components/DashboardProfile';
import Posts from '../components/Posts';
import Users from '../components/Users';

const Dashboard = () => {

  const location = useLocation();
  const [tab,setTab] = useState('')


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if(tabFromURL) {
          setTab(tabFromURL)
    }    
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      {/* Sidebar */}
      <div className='md:w-56'>
        <DashboardSidebar />
      </div>
      {/* Profile */}
      {/* w-full max-w-lg mx-auto */}
      <div className='w-full'>
        {tab === "profile" && <DashboardProfile />}
        {tab === "posts" && <Posts />}
        {tab === "users" && <Users />}
      </div>
    </div>
  )
}

export default Dashboard