import React, { useEffect, useState } from 'react'
import {Sidebar, SidebarItem, SidebarItemGroup, SidebarItems} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation ,useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../app/slice/userSlice';

const DashboardSidebar = () => {
  const location = useLocation();
  const [tab,setTab] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get('tab');
    if(tabFromURL) {
          setTab(tabFromURL)
    }    
  },[location.search])

  const handleSignOut = async() => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method : "POST"
      })
      const data = await res.json();
      if(!res.ok) {
        console.log(data.message); 
      } else{
        dispatch(signoutSuccess())
        navigate('/signin')

      }
    } catch (error) {
      console.log(error.message);
      
    }
  }
  return (
    <Sidebar className='w-full md:w-56'>
       <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem active= {tab==="profile"} 
          href="/dashboard?tab=profile" icon={HiUser} label ="User" labelColor = "dark">
          Profile
          </SidebarItem>
        
          
          <SidebarItem onClick={handleSignOut} icon={HiArrowSmRight}  className=' cursor-pointer'>
          Sign Out
          </SidebarItem>
        </SidebarItemGroup>
       </SidebarItems>
    </Sidebar>
  )
}

export default DashboardSidebar